const express = require('express');

const projectRoutes= require('./twoRouters/projectRouters');

const actionRoutes = require('./twoRouters/actionsRouters')


// similar to: import db from './data/hubs-model';



const server = express();

server.use('/projects',projectRoutes)
server.use('/actions', actionRoutes)

// Middleware
server.use(express.json()); // teaches express how to parse JSON from the request body

// Endpoints

// introduce `routing` and explain how requests are routed to the correct
// `request handler function` based on the URL and HTTP verb on the request.
// Explain what `req` and `res` are.
server.get('/', (req, res) => {
  // name is not important (could be request, response), position is.
  res.send('Hello World!');
  // .send() is a helper method that is part of the response object
});

server.get('/now', (req, res) => {
  const now = new Date().toISOString();
  res.send(now);
});





server.listen(9000, () => {
  console.log('\n*** Server Running on http://localhost:9000 ***\n');
});
