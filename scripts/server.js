#!/usr/bin/env

require('isomorphic-fetch')
require('./helpers/local-config')

const http = require('http')
const co = require('co').wrap
const pick = require('object.pick')
const express = require('express')
const expressGraphQL = require('express-graphql')
const { createSchema } = require('../schemas')
const Backend = require('../backend')
// const createResolvers = require('../resolvers')
const objects = {
  _cache: {},
  getObjectByLink: co(function* (link) {
    if (link in objects._cache) {
      return objects._cache[link]
    }

    throw new Error('not found')

    // debugger
    // throw new Error('getObjectByLink not available in this environment')
  })
}

const port = 4000
const time = String(1499486259331)
const models = require('./helpers/models')
const backend = new Backend({
  hashKey: '_link',
  prefix: {
    metadata: 'm',
    data: 'd'
  },
  models,
  objects
})

const { tables, resolvers } = backend
const { schema, schemas } = createSchema({
  resolvers,
  models,
  tables
})

const app = express()
const GRAPHQL_PATH = '/graphql'
app.use(GRAPHQL_PATH, expressGraphQL(req => ({
  schema,
  graphiql: true,
  pretty: true
})))

app.set('port', port)
let server = http.createServer(app)
server.listen(port)

const createClient = require('../client')
const client = createClient({
  schemas,
  models,
  endpoint: `http://localhost:${port}${GRAPHQL_PATH}`
})

// setTimeout(function () {
//   const gql = require('graphql-tag')
//   client.query({
//       query: gql(`
//         query {
//           rl_tradle_PhotoID {
//             _link,
//             scan {
//               url
//             }
//           }
//         }
//       `),
//     })
//     .then(data => console.log(prettify(data)))
//     .catch(error => console.error(error));
// }, 1000)

// function prettify (obj) {
//   return JSON.stringify(obj, null, 2)
// }