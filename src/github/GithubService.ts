import { injectable } from "tsyringe";
import fetch from "isomorphic-fetch";
import { IBookmark } from "./Ibookmark";
import { ConfigService, IConfig } from "../config/ConfigService";
import { UtilService } from "../UtilService";

@injectable()
export class GithubService {
    config: IConfig;
    constructor(
      private configService: ConfigService,
      private utilService: UtilService
      ){
        this.config = this.configService.getConfig();
    }
    composeBookmark(bookmark: IBookmark, dateString: string ){
        const {link, value} = bookmark;
        return `### ${dateString}\n- [${value}](${link})\n\n`
    }
    addBookmark(bookmark: IBookmark){
      const {link, value} = bookmark;
      return `- [${value}](${link})\n`
    }
    insertBookmark(text: string, bookmark: IBookmark){
        const header = "# Web Development Bookmarks\n\n"
        const splittedText = text.split(header);
        const dateString = this.utilService.getTodayDate();
        if(text.includes(dateString)){
            const bookmarkStart = `### ${dateString}`;
            const bookmarkEnd = '###';
            const separedStart = text.split(bookmarkStart);
            const bookmarksContent = separedStart[1];
            const separedBookmark = bookmarksContent.split(bookmarkEnd);
            const addedBookmark = this.addBookmark(bookmark);
            const concatBookmark = `${bookmarkStart} ${separedBookmark[0]} ${addedBookmark}`
            const newBookmarksArray = [concatBookmark, ...(separedBookmark.slice(1))];
            return ([separedStart[0], newBookmarksArray.join(bookmarkEnd)]).join('');
        }
        const newBookmark = this.composeBookmark(bookmark, dateString);
        return [header,newBookmark, ...splittedText].join('');
    }
    get(){
        return fetch("https://api.github.com/repos/FortechRomania/js-team-showcase/contents/we-recommend/daily-bookmarks.md").then((res: any)=>res.json());
    }
    getContent(url: string){
        return fetch(url).then((res: any)=>res.text());
    }
    update(content: string, sha: string){
      const {name, email, defaultBranch, token, username} = this.config;
        const options = {
            branch: defaultBranch,
            message: "Auto-Updated by our Slack BOT",
            committer: {
                name,
                email
            },
            content,
            sha
        };
        return fetch(
        "https://api.github.com/repos/FortechRomania/js-team-showcase/contents/we-recommend/daily-bookmarks.md",
        {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'User-Agent': `${username}`
            },
            body:JSON.stringify(options)
        }
      ).then((res: any)=>res.json());
    }

}
