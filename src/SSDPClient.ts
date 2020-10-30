import { getLogger } from "@log4js-node/log4js-api";
import { EventEmitter } from "events";
import { Socket, createSocket } from "dgram";
import { SSDPNotifyEvent, SSDPSearchResponseEvent } from "./SSDPEvent";

const logger = getLogger("ssdp-client");

const SSDP_HOST = "239.255.255.250";
const SSDP_PORT = 1900;

export enum SSDPClientEvents {
  SSDP_NOTIFY_MESSAGE_RECEIVED = "ssdp-notify-message-received",
  SSDP_SEARCH_RESPONSE_RECEIVED = "ssdp-search-response-received",
}

const ssdpAllMessage = Buffer.from(
  [
    "M-SEARCH * HTTP/1.1",
    "HOST: 239.255.255.250:1900",
    'MAN: "ssdp:discover"',
    "MX: 2",
    "ST: ssdp:all",
    "USER-AGENT: codersparks-home-assistant/ssdp-client",
  ].join("\r\n")
);

class SSDPClient extends EventEmitter {
  socket: Socket = createSocket({ type: "udp4", reuseAddr: true });

  startDeviceScan = (
    localIPAddr = "0.0.0.0",
    localPort: number = SSDP_PORT
  ): void => {
    logger.info("Starting scanning...");
    this.socket.on("listening", () => {
      this.socket.addMembership(SSDP_HOST);
      this.socket.setBroadcast(true);
      this.socket.setMulticastTTL(64);
      this.socket.send(ssdpAllMessage, SSDP_PORT, SSDP_HOST);
      logger.info(
        "Created listener on " +
          this.socket.address().address +
          ":" +
          this.socket.address().port
      );
    });

    this.socket.on("error", (error) => {
      logger.error(error);
    });

    this.socket.on("message", (message) => {
      const ssdpMessage = message.toString();

      if (ssdpMessage.startsWith("NOTIFY")) {
        logger.trace("NOTIFY Message received: " + ssdpMessage);

        const event = new SSDPNotifyEvent(ssdpMessage);

        logger.debug("Emitting SSDP Message: " + event.nt);
        logger.trace(event);

        this.emit(SSDPClientEvents.SSDP_NOTIFY_MESSAGE_RECEIVED, event);
      } else if (ssdpMessage.startsWith("HTTP/1.1 200 OK")) {
        logger.trace("MSearch Response Message received: " + ssdpMessage);
        const event = new SSDPSearchResponseEvent(ssdpMessage);

        logger.debug("Emitting MSearch response event: " + event.usn);
        logger.trace(event);
        this.emit(SSDPClientEvents.SSDP_SEARCH_RESPONSE_RECEIVED, event);
      } else {
        logger.info("Message is not NOTIFY ignoring: " + ssdpMessage);
      }
    });

    this.socket.bind(localPort, localIPAddr);
  };

  stopDeviceScan = (): void => {
    this.socket.close();
  };
}

export const ssdpClient = new SSDPClient();
