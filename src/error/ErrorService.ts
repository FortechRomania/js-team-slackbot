import { injectable } from "tsyringe";
import { ErrorMessage } from "./ErrorMessage";

@injectable()
export class ErrorService {
    public getErrorMessage(code: number = 0) {
        const allMessages = this.getMessage();
        const message = allMessages.find(m => m.code === code) || allMessages[0];
        return new ErrorMessage(message);
    }
    private getMessage(): any[]{
      return [
        {
          statusCode: 500,
          code: 0,
          message: "Server Error",
          detailedMessage: "Something's broken on the server side"
        },
        {
          statusCode: 200,
          code: 10,
          message: "The requested resource was not found",
          detailedMessage: "The requested resource was not found in the database. Please check the request parameters"
        },
        {
          statusCode: 200,
          code: 20,
          message: "Not enough permissions",
          detailedMessage: "You don't ahve enough permissions to access the requested resource"
        },
        {
          statusCode: 200,
          code: 30,
          message: "Bad or malformed request",
          detailedMessage: "Please check the body of the request"
        },
        {
          statusCode: 200,
          code: 40,
          message: "The function executed successfully",
        },
        {
          statusCode: 200,
          code: 50,
          message: "The bookmark already exists on our GitHub",
        }
      ]
    }
}
