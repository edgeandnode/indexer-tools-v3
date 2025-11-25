const express = require('express');
var history = require('connect-history-api-fallback');
const serveStatic = require("serve-static")
const path = require('path');

let app = express();

// Content Security Policy - allows unsafe-eval for web3.js compatibility
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  );
  next();
});

app.use(history());
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Indexer Tools v3 is running on port ${port}`);
});
