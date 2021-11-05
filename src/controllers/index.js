const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) {
      filter = { userId: req.params.userId };
    }
    const count = await Model.countDocuments(filter);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query.populate({
      path: 'userId',
      model: 'User',
      select: ['avatar', 'username'],
    });
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

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Resource not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
      message: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({ ...req.body, userId: req.userId });

    res.status(201).json({
      status: 'success',
      data: doc,
      message: 'Created successfully',
    });
  });

exports.updateOne = (Model, param = '') =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      param === '' ? req.params.id : req.params[param],
      { $set: { ...req.body, updatedTime: new Date() } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError('Resource not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Info updated successfully',
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Resource not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Deleted successfully',
    });
  });
