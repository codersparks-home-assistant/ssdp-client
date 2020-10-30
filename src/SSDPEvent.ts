import { getLogger } from "@log4js-node/log4js-api";

const logger = getLogger("ssdp-events");

export class SSDPNotifyEvent {
  host = "";
  location = "";
  opt = "";
  nt = "";
  nts = "";
  server = "";
  userAgent = "";
  usn = "";
  other: { name: string; value: string }[] = [];

  constructor(ssdpResponse: string) {
    const responseLines: string[] = ssdpResponse.split(/\r?\n/);

    logger.trace("Response Lines:" + responseLines);

    responseLines.forEach((line: string) => {
      const splitLine: string[] = line.split(":");

      logger.trace("Split line: " + splitLine);

      if (splitLine.length > 1) {
        const header = splitLine.shift();
        // We recreate any remaining values
        const value: string = splitLine.join(":");

        if (header) {
          switch (header.trim()) {
            case "HOST":
              logger.trace("found host: " + value.trim());
              this.host = value.trim();
              break;
            case "LOCATION":
              this.location = value.trim();
              break;
            case "OPT":
              this.opt = value.trim();
              break;
            case "NT":
              this.nt = value.trim();
              break;
            case "NTS":
              this.nts = value.trim();
              break;
            case "SERVER":
              this.server = value.trim();
              break;
            case "USN":
              this.usn = value.trim();
              break;
            case "X-User-Agent":
              this.userAgent = value.trim();
              break;
            default:
              this.other.push({ name: header.trim(), value: value.trim() });
              break;
          }
        }
      } else {
        logger.trace("Not of header:value format, adding to other field");
        this.other.push({ name: line, value: "" });
      }
    });
  }
}

export class SSDPSearchResponseEvent {
  st = "";
  usn = "";
  ext = "";
  server = "";
  location = "";
  opt = "";
  other: { name: string; value: string }[] = [];

  constructor(ssdpResponse: string) {
    const responseLines: string[] = ssdpResponse.split(/\r?\n/);

    logger.trace("Response Lines:" + responseLines);

    responseLines.forEach((line: string) => {
      const splitLine: string[] = line.split(":");

      logger.trace("Split line: " + splitLine);

      if (splitLine.length > 1) {
        const header = splitLine.shift();
        // We recreate any remaining values
        const value: string = splitLine.join(":");

        if (header) {
          switch (header.trim()) {
            case "ST":
              this.st = value.trim();
              break;
            case "LOCATION":
              this.location = value.trim();
              break;
            case "OPT":
              this.opt = value.trim();
              break;
            case "EXT":
              this.ext = value.trim();
              break;
            case "SERVER":
              this.server = value.trim();
              break;
            case "USN":
              this.usn = value.trim();
              break;
            default:
              this.other.push({ name: header.trim(), value: value.trim() });
              break;
          }
        }
      } else {
        logger.trace("Not of header:value format, adding to other field");
        this.other.push({ name: line, value: "" });
      }
    });
  }
}
