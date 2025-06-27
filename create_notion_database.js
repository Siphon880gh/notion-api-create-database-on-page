const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const fetch = require('node-fetch');

// Replace with your actual integration token and parent page ID
const NOTION_TOKEN = process.env.NOTION_TOKEN || "your-secret-integration-token";
const PARENT_PAGE_ID = process.env.PARENT_PAGE_ID || "your-page-id";
const WORKSPACE_JSON = process.env.WORKSPACE_JSON || "workspace.json";

// Read the JSON template
let rawData = fs.readFileSync(WORKSPACE_JSON);
let payload = JSON.parse(rawData);

// Set the parent page ID dynamically
payload.parent = {
  "type": "page_id",
  "page_id": PARENT_PAGE_ID
}

fetch('https://api.notion.com/v1/databases', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  },
  body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => {
  if (data.object === 'database') {
    console.log('✅ Database created successfully!');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error('❌ Failed to create database:', data);
  }
})
.catch(error => {
  console.error('❌ Request failed:', error);
});