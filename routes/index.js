const CacheItemHandler = require("../src/handlers/CacheItemHandler")
const Constants        = require("../src/constants")

module.exports = function(app, db) {
  app.get("/cache-items", (request, response) => {
    CacheItemHandler.getAll(request, response, db)
      .then(results => response.json(results))
  })
  
  app.get("/cache-items/:key", (request, response, next) => {
    CacheItemHandler.findByKey(request, response, db)
        .then(results => response.status(Constants.STATUS_CODES.OK).json(results))
        .catch(next)
  })
  
  app.post("/cache-items", (request, response, next) => {
    CacheItemHandler.create(request, response, db)
        .then(results => response.status(Constants.STATUS_CODES.CREATED).json(results))
        .catch(next)
  })
  
  app.put("/cache-items/:key", (request, response, next) => {
    CacheItemHandler.update(request, response, db)
        .then(results => response.status(Constants.STATUS_CODES.NO_CONTENT).json())
        .catch(next)
  })
  
  app.delete("/cache-items/:key", (request, response, next) => {
    CacheItemHandler.deleteCacheItem(request, response, db)
        .then(results => response.status(Constants.STATUS_CODES.NO_CONTENT).json())
        .catch(next)
  })
  
  app.delete("/cache-items", (request, response, next) => {
    CacheItemHandler.deleteAllCacheItems(request, response, db)
        .then(results => response.status(Constants.STATUS_CODES.NO_CONTENT).json())
        .catch(next)
  })
  
  app.use(function (err, req, res, next) {
    console.log(err.stack)
    console.log(err)
    res.status(500).send({ErrorDetails: "" + err})
  })
}