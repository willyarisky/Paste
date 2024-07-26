import { Client } from "@notionhq/client";
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (!process.env.NOTION_SECRET_KEY || !process.env.NOTION_DATABASE_ID) {
    return {
      status: 500,
      body: { error: "Notion credentials are not set in environment variables." },
    };
  }

  const notion = new Client({ auth: process.env.NOTION_SECRET_KEY });

  const insertData = async (data) => {
    try {
      const contentChunks = splitContent(data.content, 2000);

      const response = await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          "note": {
            title: [
              {
                type: "text",
                text: {
                  content: data.note,
                },
              },
            ],
          },
          "content": {
            rich_text: contentChunks.map(chunk => ({
              type: "text",
              text: {
                content: chunk,
              },
            })),
          },
          "created_at": {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });

      console.log("Data inserted successfully:", response);
      return {
        status: 200,
        body: response,
      };
    } catch (error) {
      console.error("Error inserting data:", error);
      return {
        status: 500,
        body: { error: "Failed to insert data into Notion database." },
      };
    }
  };

  const splitContent = (content, maxLength) => {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return content.match(regex);
  };

  const validateData = (data) => {
    if (!data) {
      return "No data provided";
    }
    if (typeof data.note !== "string" || data.note.trim() === "") {
      return "Invalid or missing 'note'";
    }
    if (typeof data.content !== "string" || data.content.trim() === "") {
      return "Invalid or missing 'content'";
    }
    return null;
  };

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const validationError = validateData(body);

      if (validationError) {
        return {
          status: 400,
          body: { error: validationError },
        };
      }

      return await insertData(body);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return {
        status: 400,
        body: { error: "Invalid request body" },
      };
    }
  } else {
    return {
      status: 405,
      body: { error: "Method not allowed" },
    };
  }
});
