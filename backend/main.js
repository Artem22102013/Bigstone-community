const express = require("express");
const nextJS = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = nextJS({ dev });
const handle = app.getRequestHandler();

const http = require('http');
const url = require('url');

app.prepare().then(() => {
  const server = express();

  const fs = require("fs");
  const path = require("path");

  server.get("/oauth", (req, res) => {
    res.send("OAuth endpoint");
  });

  // nextjs fallback
  server.use((req, res, next) => {
    handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });           
});