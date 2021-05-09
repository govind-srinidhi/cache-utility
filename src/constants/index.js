/**
 * This file contains all the constants that are used in the project.
 */

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  CLIENT_ERROR: 400,
  SERVER_ERROR: 500
}

const COLLECTIONS = {
  CACHE_ITEM: "cache"
}

module.exports = {
  CACHE_TTL_IN_MILLIS: 60*1000,
  MAX_CACHE_ITEMS: 5,
  COLLECTIONS,
  STATUS_CODES
}