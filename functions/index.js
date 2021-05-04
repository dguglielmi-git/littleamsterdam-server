const admin = require("firebase-admin");
const functions = require("firebase-functions");
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const serviceAccount =require('./lamsterdam-graphql-firebase-adminsdk-l7rqk-ee95d0b651.json')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });
exports.graphql = functions.https.onRequest(app);