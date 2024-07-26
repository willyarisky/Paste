import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  const notion = new Client({ auth: process.env.NOTION_SECRET_KEY });

  // Function to fetch data from the database by page ID
  const fetchData = async (pageId) => {
    try {
      const response = await notion.pages.retrieve({ page_id: pageId });
      return {
        status: 200,
        body: response,
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
