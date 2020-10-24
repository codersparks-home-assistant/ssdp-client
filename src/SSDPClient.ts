import { getLogger } from "@log4js-node/log4js-api";
import { EventEmitter } from "events";
import { Socket, createSocket } from "dgram";
import { SSDPEvent } from "./SSDPEvent";

const logger = getLogger("ssdp-client");

const SSDP_HOST = "239.255.255.250";
const SSDP_PORT = 1900;

export enum SSDPClientEvents {
  SSDP_MESSAGE_RECEIVED = "ssdp-message-received",
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

    this.socket.on('error', (error) => {
      logger.error(error);
    })

    this.socket.on("message", (message) => {
      const ssdpMessage = message.toString();
      logger.debug("Message received: " + ssdpMessage);

      const event = new SSDPEvent();
      event.init(ssdpMessage);

      logger.debug("Emitting SSDP Message");
      logger.debug(event);


      this.emit(
        SSDPClientEvents.SSDP_MESSAGE_RECEIVED, event
      );
    });

    this.socket.bind(SSDP_PORT);
  };

  stopDeviceScan = (): void => {
    this.socket.close();
  };
}

export const ssdpClient = new SSDPClient();
