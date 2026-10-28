# SaveWise

A small bilingual (English/Chinese) budgeting app for students. It records income, expenses, and savings transfers in the browser's local storage, then produces a privacy-conscious monthly summary that can be pasted into any AI chat.

## Run locally

Open `index.html` in a browser. No build step or server is required.

## Deploy with Cloudflare Workers

This is a static site served by a Cloudflare Worker. There is no build step; `wrangler.jsonc` points the Worker at the site files in the repository root. The `.assetsignore` file keeps project and deployment configuration files out of the public assets.

Data stays in the browser where it was entered; it is not synchronized between devices.
