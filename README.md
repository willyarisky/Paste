# Paste.js.org
### Free Pastebin alternative

Deploy your Free Paste app with Vercel and Notion

### Copy Notion Template

1. **Access the Template**:
   - Click on the following link to open the Notion template: [Notion Template](https://pastejs.notion.site/6ec5ed3e60424373ab15d7a422caff41?v=4dd16f12cfc941f4b0c6a791c6391267&pvs=73).

2. **Duplicate the Template**:
   - Once the template is open, locate the "Duplicate" button in the top-right corner.
   - Click "Duplicate" to add the template to your own Notion workspace.

### Generate Notion API Key for your Workspace

1. **Go to the Notion Integration Page**: 
   - Visit [Notion Integrations](https://www.notion.so/my-integrations).

2. **Create a New Integration**:
   - Click on the "New integration" button.

3. **Fill Out the Integration Details**:
   - **Name**: Enter a name for your integration.
   - **Associated Workspace**: Choose the workspace you want to integrate with.
   - **Type**: Choose the "Internal" option to create an internal integration.

4. **Submit and Save**:
   - After filling out the details, click on "Submit".
   - Once submitted, you'll be redirected to a page with your integration details.

5. **Copy the Internal API Key**:
   - Locate the "Internal Integration Token" section.
   - Click on the "Show" button to reveal the key.
   - Copy the displayed internal API key to use in your application.
  
### Connect the Copied Template to Your Notion Integration

Follow these steps on [Notion](https://www.notion.so/help/add-and-manage-connections-with-the-api).

### Deploy on Vercel

Deploy your application easily on Vercel using the following button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwillyarisky%2FPaste&env=APP_NAME,NOTION_SECRET_KEY,NOTION_DATABASE_ID&envDescription=Notion%20API%20Keys%20needed&project-name=paste-pt&repository-name=Paste.pt)

To proceed with the deployment:

1. **Click the Button**: 
   - Click the "Deploy with Vercel" button above to start the deployment process.

2. **Fill in Environment Variables**:
   - In the Vercel deployment interface, you will be prompted to enter the required environment variables.
   - Enter the following details:
     - `APP_NAME=`: Your application's name.
     - `NOTION_SECRET_KEY=`: The internal API key you generated for your Notion integration.
     - `NOTION_DATABASE_ID=`: The ID of the Notion database you want to connect to.

3. **Deploy**:
   - After filling in the environment variables, click the "Deploy" button to deploy your application on Vercel.

This will set up your application with the necessary Notion API keys and database connection, allowing you to utilize your Notion data within the deployed application.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

### Technical Support

For technical support, please visit [Technical Support](https://buy.stripe.com/fZe6ru8AT9PefoAbII).

Note: This application is free and open-source. However, I do not provide customization services for the app. Please refer to the link above for any technical support.
