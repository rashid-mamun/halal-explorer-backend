const NodeCache = require("node-cache");
const myCache = new NodeCache();
const hourlyTTL = 3600;

/**
 * Retrieves data from the cache based on a search ID.
 * @param {string} searchId - The unique identifier for the cached data.
 * @returns {Object} - An object containing success status and cached data if found.
 */
async function getCacheData(searchId) {
    const cachedData = myCache.get(searchId);

    if (cachedData === undefined) {
        console.log(`Cache miss for searchId: ${searchId}`);
        return { success: false };
    } else {
        console.log(`Cache hit for searchId: ${searchId}`);
        return {
            success:true,
            cache:cachedData
        };
    }
}

/**
 * Sets data in the cache with a specified TTL.
 * @param {string} searchId - The unique identifier for the cached data.
 * @param {any} cacheData - The data to be cached.
 * @returns {Promise<any>} - A promise that resolves to the cached data if successful.
 */
async function setCacheData(searchId, cacheData) {
    try {
        console.log(`Setting cache for searchId: ${searchId}`);
        myCache.set(searchId, cacheData, hourlyTTL * 6);
        return cacheData;
    } catch (error) {
        console.error("Error setting cache:", error);
        throw new Error("Error setting cache");
    }
}

module.exports = {
    setCacheData,
    getCacheData
}
