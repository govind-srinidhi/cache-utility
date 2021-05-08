/**
 * This file creates and maintains database connection
 */

const MongoClient = require("mongodb").MongoClient

const env_host = process.env.DB_HOST || "localhost"
const env_port = process.env.DB_PORT || 27017
const env_pool = process.env.DB_POOL || 5
const env_db_name = process.env.DB_NAME || "cache"

const CONNECTION_URL = `mongodb://${env_host}:${env_port}/${env_db_name}?poolSize=${env_pool}&usNewUrlParser=true&useUnifiedTopology=true`;

function connect(url) {
  return MongoClient.connect(url).then(client => client.db())
}

module.exports = async function() {
  let cacheDb = await connect(CONNECTION_URL)
  return { cacheDb }
}