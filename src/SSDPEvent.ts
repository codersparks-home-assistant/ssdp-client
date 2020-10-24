import { getLogger } from "@log4js-node/log4js-api";

const logger = getLogger("ssdp-events");

export class SSDPEvent {
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

    logger.debug("Response Lines:" + responseLines);

    responseLines.forEach((line: string) => {
      const [header, value] = line.split(":", 2);

      logger.debug("Header: " + header + " value: " + value);

      // switch (header) {
      //   case "HOST":
      //     this.host = value.trim();
      //     break;
      //   case "LOCATION":
      //     this.location = value.trim();
      //     break;
      //   case "OPT":
      //     this.opt = value.trim();
      //     break;
      //   case "NT":
      //     this.nt = value.trim();
      //     break;
      //   case "NTS":
      //     this.nts = value.trim();
      //     break;
      //   case "SERVER":
      //     this.server = value.trim();
      //     break;
      //   case "USN":
      //     this.usn = value.trim();
      //     break;
      //   case "X-User-Agent":
      //     this.userAgent = value.trim();
      //     break;
      //   default:
      //     this.other.push({ name: header.trim(), value: value.trim() });
      //     break;
      // }
    });
  }
}
