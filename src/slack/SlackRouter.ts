import { RouterBuilder } from "../router/RouterBuilder";
import { ErrorService } from "../error/ErrorService";
import { injectable } from "tsyringe";
import { ChallengeMiddleware } from "../middlewares/ChallengeMiddleware";
import { ConfigService, IConfig } from "../config/ConfigService";
import { GithubService } from "../github/GithubService";
import { Base64 } from 'js-base64';
import { UtilService } from '../UtilService'
import { SlackService } from "./SlackService";

@injectable()
export class SlackRouter {
  config: IConfig;
  constructor(
      private errorService: ErrorService,
      private configService: ConfigService,
      private githubService: GithubService,
      private utilService: UtilService,
      private slackService: SlackService
    ){
    this.config = this.configService.getConfig();
  }
  printMessage =
    new RouterBuilder()
    .path("/")
    .middlewares(ChallengeMiddleware)
    .post(async ({req: { body: { event }, body } }) => {
      if(!event){
        throw this.errorService.getErrorMessage(30);
      }
      const {channel, text, type, subtype} = event;

      if(channel !== this.config.channelID){
        return { message: "Recieved message from another channel" }
      }
      console.log("RECIEVED BODY", JSON.stringify(body));

      if(type !== 'message' || subtype){
        return { message: "The event is not for a new message" }
      }
      const bookmarks = await this.githubService.get();
      if(!bookmarks.git_url){
        throw this.errorService.getErrorMessage(30);
      }
      const fileContent = await this.githubService.getContent(bookmarks.git_url);
      const { content } = JSON.parse(fileContent);
      const parsedContent = Base64.decode(content);

      const bookmarkData = await this.utilService.composeBookmark(text);

      if(parsedContent.includes(bookmarkData.value) || parsedContent.includes(bookmarkData.link)){
        console.log(parsedContent.includes(bookmarkData.value))
        throw this.errorService.getErrorMessage(50);
      }

      const bookmarkedContent = this.githubService.insertBookmark(parsedContent, bookmarkData);
      const encodedContent = Base64.encode(bookmarkedContent);

      await this.githubService.update(encodedContent, bookmarks.sha);

      await this.slackService.sendMessage(`Added *${bookmarkData.value}* to Daily Bookmarks`)
    });
}
