import { getLogger } from "@log4js-node/log4js-api";
import { EventEmitter } from "events";
import { Socket, createSocket } from "dgram";
import { SSDPNotifyEvent } from "./SSDPEvent";

const logger = getLogger("ssdp-client");

const SSDP_HOST = "239.255.255.250";
const SSDP_PORT = 1900;

export enum SSDPClientEvents {
  SSDP_NOTIFY_MESSAGE_RECEIVED = "ssdp-notify-message-received",
}

class SSDPClient extends EventEmitter {
  socket: Socket = createSocket({ type: "udp4", reuseAddr: true });

  startDeviceScan = (): void => {
    logger.info("Starting scanning...");
    this.socket.on("listening", () => {
      this.socket.addMembership(SSDP_HOST);
      this.socket.setBroadcast(true);
      this.socket.setMulticastTTL(64);
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

      if(ssdpMessage.startsWith("NOTIFY")) {
        logger.info("NOTIFY Message received: " + ssdpMessage);

        const event = new SSDPNotifyEvent(ssdpMessage);


        logger.debug("Emitting SSDP Message");
        logger.debug(event);

        this.emit(SSDPClientEvents.SSDP_NOTIFY_MESSAGE_RECEIVED, event);
      } else {
        logger.info("Message is not NOTIFY ignoring: " + ssdpMessage);
      }
    });

    this.socket.bind(SSDP_PORT);
  };

  stopDeviceScan = (): void => {
    this.socket.close();
  };
}

export const ssdpClient = new SSDPClient();
