
const CommonUtils = require("../utils/CommonUtils")
const Constants   = require("../constants")


const getAll = async function getAll(db) {
  const results = await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).find().toArray()
  return results
}

const findByKey = async function findByKey(db, key) {
  const searchCriteria = {
    "key": key
  }
  const cacheItem = await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).findOne(searchCriteria, {})
  
  if (cacheItem) {
    if (isTtlValid(cacheItem)) {
      console.log("Cache Hit")
      const currentTime = new Date().getTime();
      const updateJson = {
          "ttl": new Date(currentTime + Constants.CACHE_TTL_IN_MILLIS),
          "last_access_time": currentTime
      }
      await updateCacheItem(db, key, updateJson);
      return {...cacheItem, ...updateJson}
    } else {
        const newCacheItem = await replaceCacheItem(db, key);
        return {
          ...cacheItem, ...{
              value: newCacheItem.value,
              ttl: newCacheItem.ttl,
              last_access_time: newCacheItem.last_access_time
          }
        }
    }
  } else {
    console.log("Cache Miss")
    const cacheItem = {
      "key": key,
      "value": CommonUtils.generateRandomString(5)
    }
    return await createCacheItem(db, cacheItem);
  }
}

const updateCacheItem = async function updateCacheItem(db, key, updateJson) {
  const searchCriteria = {
    "key": key
  }
  await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).updateOne(searchCriteria, {$set: updateJson})
}

const createCacheItem = async function createCacheItem(db, cacheItem) {
  const countOfCollection = await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).countDocuments({});
  if (countOfCollection >= Constants.MAX_CACHE_ITEMS) {
      await removeByLru(db);
  } else if (countOfCollection === 0) {
    await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).createIndex({ttl: 1}, {expireAfterSeconds: Constants.CACHE_TTL_IN_MILLIS/1000})
  }
  const currentTime = new Date().getTime();
  cacheItem.ttl = new Date(currentTime + Constants.CACHE_TTL_IN_MILLIS)
  cacheItem.last_access_time = currentTime
  const insertedItem = await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).insertOne(cacheItem)
  return insertedItem ? insertedItem.ops : ""
}

const replaceCacheItem = async function replaceCacheItem(db, key) {
  const searchCriteria = {
    "key": key
  }
  const currentTime = new Date().getTime();
  const updateJson = {
    "value": CommonUtils.generateRandomString(5),
    "ttl": new Date(currentTime + Constants.CACHE_TTL_IN_MILLIS),
    "last_access_time": currentTime
  }
  await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).updateOne(searchCriteria, {$set: updateJson})
  return {...updateJson, ...searchCriteria}
}

const deleteCacheItem = async function deleteCacheItem(db, key) {
  const searchCriteria = {
    "key": key
  }
  await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).deleteOne(searchCriteria)
}

const deleteAllCacheItems = async function deleteAllCacheItems(db) {
  await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).drop()
}

const removeByLru = async function removeByLru(db) {
  const sortCondition = {
    "last_access_time": 1
  }
  const cursor = await db.cacheDb.collection(Constants.COLLECTIONS.CACHE_ITEM).find().sort(sortCondition).limit(1);
  if (cursor.hasNext()) {
    const lruItem = await cursor.next();
    await deleteCacheItem(db, lruItem.key)
  }
}

const isTtlValid = function isTtlValid(cacheItem) {
  const currentTime = new Date();
  return currentTime.getTime() <= cacheItem.ttl;
}

module.exports = {
  getAll,
  findByKey,
  updateCacheItem,
  createCacheItem,
  replaceCacheItem,
  deleteCacheItem,
  deleteAllCacheItems,
  removeByLru
}