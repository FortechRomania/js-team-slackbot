import fetch from "isomorphic-fetch";
import { injectable } from "tsyringe";
import { ConfigService, IConfig } from "../config/ConfigService";

@injectable()
export class SlackService {
  config: IConfig;
  constructor(private configService: ConfigService){
    this.config = this.configService.getConfig();
  }
  sendMessage(message) {
    const { channelID, slackToken } = this.config;
    const body = {
      channel: channelID,
      text: message,
      as_user: true
    }
    return fetch(
      "https://slack.com/api/chat.postMessage",
      {
        method:'POST',
        headers: {
          Authorization: `Bearer ${slackToken}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
      }
    ).then((res: any)=> res.json());
  }
}
