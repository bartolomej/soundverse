import { Handler } from '@netlify/functions'
import * as fetch from "node-fetch";

export const handler: Handler = async (event, context) => {
  const { q } = event.queryStringParameters

  const result = await search(q);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow from anywhere
    },
    body: JSON.stringify(result),
  }
}
async function search (q: string): Promise<any> {
  return fetch.default(`https://api.deezer.com/search?q=${q}`).then((res: any) => res.json());
}
