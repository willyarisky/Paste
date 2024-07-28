import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  const notion = new Client({ auth: process.env.NOTION_SECRET_KEY });

  const fetchData = async (groupId) => {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
          property: "group_id",
          rich_text: {
            equals: groupId,
          },
        },
        sorts: [
          {
            property: "created_at",
            direction: "ascending",
          },
        ],
      });

      const pages = response.results;

      if (!pages.length) {
        return {
          status: 404,
          body: { error: "No data found" },
        };
      }

      // Aggregate content
      const aggregatedContent = pages.map(page => {
        const contentProperty = page.properties.content;
        if (contentProperty && contentProperty.rich_text) {
          return contentProperty.rich_text.map(text => text.text.content).join("");
        }
        return "";
      }).join("\n");

      // Check for the existence of the note property
      const noteProperty = pages[0].properties.note;
      const noteTitle = noteProperty && noteProperty.title && noteProperty.title[0] && noteProperty.title[0].text ? noteProperty.title[0].text.content : "No note title";

      // Check for the existence of the created_at property
      const createdAtProperty = pages[0].properties.created_at;
      const createdAt = createdAtProperty && createdAtProperty.date ? createdAtProperty.date.start : "No creation date";

      return {
        status: 200,
        body: {
          note: noteTitle,
          content: aggregatedContent,
          created_at: createdAt,
        },
      };
    } catch (error) {
      console.error("Error retrieving data:", error);
      return {
        status: 500,
        body: { error: error.message },
      };
    }
  };

  // Extract the ID from the URL
  const { id } = event.context.params;

  // Handle GET request
  if (event.node.req.method === 'GET') {
    return await fetchData(id);
  } else {
    return {
      status: 405,
      body: { error: "Method not allowed" },
    };
  }
});
