# SaveWise

A small bilingual (English/Chinese) budgeting app for students. It records income, expenses, and savings transfers in the browser's local storage, then produces a privacy-conscious monthly summary that can be pasted into any AI chat.

## Run locally

Open `index.html` in a browser. No build step or server is required.

## Deploy with Cloudflare Pages

This is a static site. Set the Pages build command to blank and the output directory to `.`. The Wrangler Pages configuration in this repository also points to the repository root.

Data stays in the browser where it was entered; it is not synchronized between devices.

