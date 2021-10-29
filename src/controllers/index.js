const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (!req.query.all) filter = { userId: req.userId };
    const count = await Model.countDocuments(filter);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        count,
        data: doc,
        currentCount: doc.length,
      },
      message: null,
    });
  });
