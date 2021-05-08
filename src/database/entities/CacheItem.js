/**
 * This is a model for the Cache DB object, saved in the cache document
 */
 export default class CacheItem {
  constructor(
      key,
      value,
      latest_access_time,
      ttl
  ) {
      this.key = key
      this.value = value
      this.latest_access_time = latest_access_time
      this.ttl = ttl
  }

}