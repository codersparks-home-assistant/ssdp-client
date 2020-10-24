import { getLogger } from "@log4js-node/log4js-api";


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

    responseLines.forEach((line: string) => {
      const header_value: string[] = line.split(":", 1);

      if (header_value.length == 2) {
        const header: string = header_value[0];
        const value: string = header_value[1];

        switch (header.trim()) {
          case "HOST":
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
      } else {
        this.other.push({ name: header_value[0], value: "" });
      }
    });
  };
}
