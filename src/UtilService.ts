import { IBookmark } from "./github/Ibookmark";
import { injectable } from "tsyringe";
import { ErrorService } from "./error/ErrorService";
import urlMetadata from 'url-metadata';

const urlExpression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const slackUrlWrapperExpression = /[<>]/gi;
const urlRegex = new RegExp(urlExpression);
const slackUrlWrapperRegex = new RegExp(slackUrlWrapperExpression);

@injectable()
export class UtilService {
  constructor(private errorService: ErrorService){

  }
  async composeBookmark(text :string): Promise<IBookmark> {
    const textStartsWithTech = this.startsWithText(text, 'tech')
    const link = this.getTextLinks(text);
    if(textStartsWithTech && link){
      const {title: value} = await this.getMetadata(link);
      if(!value){
        throw this.errorService.getErrorMessage(30);
      }
      return {link, value};
    }
    throw this.errorService.getErrorMessage(30);
  }

  getTextLinks(text: string){
    return text.split(' ').reduce((link, word) => {
      if(!link && word.match(urlRegex)) {
        return word.replace(slackUrlWrapperRegex, '');
      }
      return link;
    }, '')
  }

  getMetadata(url: string) {
    return urlMetadata(url);
  }

  startsWithText(text: string, word: string): boolean {
    return text.toLowerCase().startsWith(word);
  }
  getTodayDate(){
    const date = new Date();
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = date.getDate();
    return `${day}.${month}.${year}`
  }
}
