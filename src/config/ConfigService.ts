import {singleton} from "tsyringe";
import * as devConfig from "../config.dev.json";

export interface IConfig {
    port?: number | string | undefined;
    channelID?: string;
    token?: string;
    username?: string;
    defaultBranch?: string;
    name?: string;
    email?: string;
    slackToken?: string;
}

@singleton()
export class ConfigService {

    private config: IConfig;

    constructor() {
        const { NODE_ENV } = process.env;
        if(NODE_ENV === 'production'){
          const {
            port,
            channelID,
            token,
            username,
            defaultBranch,
            name,
            email,
            slackToken,
          } = process.env;

          this.config = {
            port,
            channelID,
            token,
            username,
            defaultBranch,
            name,
            email,
            slackToken,
          }
        }
        else{
          this.config = devConfig;
        }
    }
    public getConfig(): IConfig {
        return this.config;
    }
}
