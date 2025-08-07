const { createClient } = require('redis');
const logger = require('../utils/logger');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => {
    logger.info('Redis Client Connected', { service: 'halal-explore' });
});

redisClient.on('ready', () => {
    logger.info('Redis Client Ready', { service: 'halal-explore' });
});

redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err, { service: 'halal-explore' });
});

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            logger.info('Redis connected successfully', { service: 'halal-explore' });
        }
        return redisClient;
    } catch (error) {
        logger.error('Redis connection failed:', error, { service: 'halal-explore' });
        throw new Error('Failed to connect to Redis');
    }
};

module.exports = { redisClient, connectRedis };