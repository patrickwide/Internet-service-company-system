// import express
const express = require('express');

// import colors
const colors = require('colors');

// import cors
const cors = require('cors');

// import dotenv
require('dotenv').config();

// import graphqlHTTP
const { graphqlHTTP } = require('express-graphql');

// import schemas and mutations
const schemas = require("./schemas");

// import the database
const connectDB = require('./database/configs/db');

// import JsonWebTokenError
const jwt = require('jsonwebtoken');

// get port from the .env
const port = process.env.PORT || 5000;

// init server
const app = express();

// Connect to database
connectDB();

// use cors
app.use(cors());

// app.use(authMiddleware);
// wait for graphql requests
app.use(
    '/graphql', graphqlHTTP((req) => ({
        schema:schemas,
        graphiql: process.env.NODE_ENV === 'development',
    })),
);

// Listen for requests
app.listen(port, console.log(`Server running on port ${port}`.rainbow.underline.bold));