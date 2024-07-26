import { Client } from "@notionhq/client";
import { readBody } from 'h3';
import { v4 as uuidv4 } from 'uuid';  // Add this line to import uuid

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
      // Replace newline characters with <<N>>
      const processedContent = data.content.replace(/\n/g, '<<N>>');
      
      const contentChunks = splitContent(processedContent, 2000);
      const richTextChunks = splitIntoRichTextChunks(contentChunks, 100);

      const groupId = uuidv4();  // Generate a unique identifier for the group

      for (const richTextChunk of richTextChunks) {
        const response = await notion.pages.create({
          parent: { database_id: process.env.NOTION_DATABASE_ID },
          properties: {
            "group_id": { 
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: groupId,
                  },
                },
              ],
            },
            "content": {
              rich_text: richTextChunk,
            },
            "created_at": {
              date: {
                start: new Date().toISOString(),
              },
            },
          },
        });

        console.log("Data inserted successfully:", response);
      }
      
      return {
        status: 200,
        body: { message: "Data inserted successfully", groupId: groupId },
      };
    } catch (error) {
      console.error("Error inserting data:", error);
      return {
        status: 500,
        body: { error: "Failed to insert data into Notion database.", groupId: groupId },
      };
    }
  };

  const splitContent = (content, maxLength) => {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return content.match(regex);
  };

  const splitIntoRichTextChunks = (chunks, maxItems) => {
    const result = [];
    for (let i = 0; i < chunks.length; i += maxItems) {
      result.push(chunks.slice(i, i + maxItems).map(chunk => ({
        type: "text",
        text: {
          content: chunk,
        },
      })));
    }
    return result;
  };

  const validateData = (data) => {
    if (!data) {
      return "No data provided";
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
