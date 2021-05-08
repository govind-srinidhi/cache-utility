const CacheItemDatabaseService = require("../services/CacheItemService")


const getAll = async function getAll(request, response, db) {
  return await CacheItemDatabaseService.getAll(db)
}

const findByKey = async function findByKey(request, response, db) {
  const key = request.params.key
  return CacheItemDatabaseService.findByKey(db, key)
}

const create = async function create(request, response, db) {
  const { key, value } = request.body
  return CacheItemDatabaseService.createCacheItem(db, {key: key, value: value})
}

const update = async function update(request, response, db) {
  const key = request.params.key
  const { value } = request.body
  await CacheItemDatabaseService.updateCacheItem(db, key, {value: value})
}

const deleteCacheItem = async function deleteCacheItem(request, response, db) {
  const key = request.params.key
  await CacheItemDatabaseService.deleteCacheItem(db, request.params.key)
}

const deleteAllCacheItems = async function deleteAllCacheItems(request, response, db) {
  await CacheItemDatabaseService.deleteAllCacheItems(db)
}

module.exports = {
  getAll,
  findByKey,
  create,
  update,
  deleteCacheItem,
  deleteAllCacheItems
}