const HalalActivityRating = require('../models/HalalActivityRating');

const createHalalActivityRating = async (ratingData) => {
  try {
    const totalRating = ratingData.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      throw new Error('Total rating exceeds 100');
    }

    const halalActivityRating = new HalalActivityRating({
      ...ratingData,
      starRating: totalRating,
      isStructure: false
    });
    await halalActivityRating.save();
    return halalActivityRating;
  } catch (error) {
    throw new Error(`Failed to create halal activity rating: ${error.message}`);
  }
};

const getHalalActivityRatingByCode = async (code) => {
  try {
    const halalActivityRating = await HalalActivityRating.findOne({ code, isStructure: false });
    return halalActivityRating;
  } catch (error) {
    throw new Error(`Failed to get halal activity rating: ${error.message}`);
  }
};

const getAllHalalActivityRatings = async (page = 1, pageSize = 100) => {
  try {
    const skip = (page - 1) * pageSize;
    const halalActivityRatings = await HalalActivityRating.find({ isStructure: false })
      .skip(skip)
      .limit(pageSize)
      .sort({ lastUpdated: -1 });
    
    const total = await HalalActivityRating.countDocuments({ isStructure: false });
    
    return {
      data: halalActivityRatings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get all halal activity ratings: ${error.message}`);
  }
};

const updateHalalActivityRating = async (code, updateData) => {
  try {
    const totalRating = updateData.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      throw new Error('Total rating exceeds 100');
    }

    const halalActivityRating = await HalalActivityRating.findOneAndUpdate(
      { code, isStructure: false },
      { ...updateData, starRating: totalRating, lastUpdated: new Date() },
      { new: true }
    );
    return halalActivityRating;
  } catch (error) {
    throw new Error(`Failed to update halal activity rating: ${error.message}`);
  }
};

const deleteHalalActivityRating = async (code) => {
  try {
    const halalActivityRating = await HalalActivityRating.findOneAndDelete({ code, isStructure: false });
    return halalActivityRating;
  } catch (error) {
    throw new Error(`Failed to delete halal activity rating: ${error.message}`);
  }
};

const searchHalalActivityRatings = async (searchParams) => {
  try {
    const { 
      minRating, 
      maxRating, 
      keyword, 
      page = 1, 
      pageSize = 100 
    } = searchParams;
    const skip = (page - 1) * pageSize;
    
    let query = { isStructure: false };
    
    if (minRating !== undefined || maxRating !== undefined) {
      query.starRating = {};
      if (minRating !== undefined) {
        query.starRating.$gte = minRating;
      }
      if (maxRating !== undefined) {
        query.starRating.$lte = maxRating;
      }
    }
    
    if (keyword) {
      query.code = { $regex: keyword, $options: 'i' };
    }
    
    const halalActivityRatings = await HalalActivityRating.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ lastUpdated: -1 });
    
    const total = await HalalActivityRating.countDocuments(query);
    
    return {
      data: halalActivityRatings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to search halal activity ratings: ${error.message}`);
  }
};

const createRatingStructure = async (structureData) => {
  try {
    const totalRating = structureData.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      throw new Error('Total rating exceeds 100');
    }

    const ratingStructure = new HalalActivityRating({
      ...structureData,
      code: 'structure',
      starRating: totalRating,
      isStructure: true
    });
    await ratingStructure.save();
    return ratingStructure;
  } catch (error) {
    throw new Error(`Failed to create rating structure: ${error.message}`);
  }
};

const getRatingStructure = async () => {
  try {
    const ratingStructure = await HalalActivityRating.findOne({ code: 'structure', isStructure: true });
    return ratingStructure;
  } catch (error) {
    throw new Error(`Failed to get rating structure: ${error.message}`);
  }
};

const updateRatingStructure = async (updateData) => {
  try {
    const totalRating = updateData.ratings.reduce((total, rating) => total + rating.rating, 0);

    if (totalRating > 100) {
      throw new Error('Total rating exceeds 100');
    }

    const ratingStructure = await HalalActivityRating.findOneAndUpdate(
      { code: 'structure', isStructure: true },
      { ...updateData, starRating: totalRating, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
    return ratingStructure;
  } catch (error) {
    throw new Error(`Failed to update rating structure: ${error.message}`);
  }
};

const deleteRatingStructure = async () => {
  try {
    const ratingStructure = await HalalActivityRating.findOneAndDelete({ code: 'structure', isStructure: true });
    return ratingStructure;
  } catch (error) {
    throw new Error(`Failed to delete rating structure: ${error.message}`);
  }
};

const getRatingStatistics = async () => {
  try {
    const totalRatings = await HalalActivityRating.countDocuments({ isStructure: false });
    const averageRating = await HalalActivityRating.aggregate([
      { $match: { isStructure: false } },
      { $group: { _id: null, avgRating: { $avg: '$starRating' } } }
    ]);
    
    const ratingDistribution = await HalalActivityRating.aggregate([
      { $match: { isStructure: false } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$starRating', 20] }, then: '0-19' },
                { case: { $lt: ['$starRating', 40] }, then: '20-39' },
                { case: { $lt: ['$starRating', 60] }, then: '40-59' },
                { case: { $lt: ['$starRating', 80] }, then: '60-79' },
                { case: { $lt: ['$starRating', 100] }, then: '80-99' }
              ],
              default: '100'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return {
      success: true,
      data: {
        total: totalRatings,
        averageRating: averageRating[0]?.avgRating || 0,
        distribution: ratingDistribution
      }
    };
  } catch (error) {
    throw new Error(`Failed to get rating statistics: ${error.message}`);
  }
};

module.exports = {
  createHalalActivityRating,
  getHalalActivityRatingByCode,
  getAllHalalActivityRatings,
  updateHalalActivityRating,
  deleteHalalActivityRating,
  searchHalalActivityRatings,
  createRatingStructure,
  getRatingStructure,
  updateRatingStructure,
  deleteRatingStructure,
  getRatingStatistics
};
