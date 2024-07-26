import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  try {
    // Initialize Notion client with runtime config
    const notion = new Client({ auth: process.env.NOTION_SECRET_KEY });

    // Fetch the database query response
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    // Return the response with status 200
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    // Handle and return the error with status 500
    return {
      status: 500,
      body: { error: error.message },
    };
  }
});
