// IMPORTS
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// FILES________________________________________________

// // Blocking, synchronous way
// const data = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(data);
// const dataToSave = `${Date.now()}\tInformation about avocado: "${data}"`;
// fs.writeFileSync('./txt/output.txt', dataToSave);
// console.log('Data was writed successfully!');

// // Non-blockin, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => console.log(data));
// console.log('Some action...');

// SERVER________________________________________________

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const parsedData = JSON.parse(data);

const hostname = '127.0.0.1';
const port = 3000;

const slugs = parsedData.map((item) =>
  slugify(item.productName, { lower: true, replacement: '-' })
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // Overwiew page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = parsedData
      .map((item) => replaceTemplate(templateCard, item))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }
  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = parsedData[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  // API page
  else if (pathname === '/products') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  // Not found
  else {
    res.statusCode = 404;
    res.write('This page cannot be found.');
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
