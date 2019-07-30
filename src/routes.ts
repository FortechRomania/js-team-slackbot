import { SlackRouter } from "./slack/SlackRouter";

interface Route{
  basePath: string,
  router: any
};

export const Routes: Route[] = [
  { basePath: "/", router: SlackRouter }
]
