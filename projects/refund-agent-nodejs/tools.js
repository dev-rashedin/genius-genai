import * as z from "zod";
import { gmailEmails } from './constants/emails.js';
import { tool } from "langchain";

export const getEmails = tool(
  () => {
    // todo: access Gmail apis
    return JSON.stringify(gmailEmails)
  },
  {
    name: "get_emails",
    description: "Get the emails from inbox",
  },
);

export const refund = tool(
  ({emails}) => {
    // todo: access backend apis
      return '✅ All refunds processed succesfully!';
  },
  {
    name: "refund",
    description: "Process the refund for given email",
    schema: z.object({
      emails: z.array(z.string()).describe("The list of the emails which need to be refunded"),
    }),
  },
);

