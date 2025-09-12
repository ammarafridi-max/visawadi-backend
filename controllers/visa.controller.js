const catchAsync = require('../utils/catchAsync');
const Visa = require('../models/Visa');
const AppError = require('../utils/appError');

exports.getAllVisas = catchAsync(async (req, res, next) => {
  const visas = await Visa.find();

  if (!visas || visas.length === 0) {
    return next(new AppError('No visas found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'All visas fetched successfully',
    results: visas.length,
    data: { visas },
  });
});

exports.getVisa = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const visa = await Visa.findOne({ slug });

  if (!visa) {
    return next(new AppError('Could not find visa details', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Visa details fetched successfully',
    data: { visa },
  });
});

exports.createVisa = catchAsync(async (req, res, next) => {
  const visa = await Visa.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Visa created successfully',
    data: { visa },
  });
});

exports.updateVisa = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const visa = await Visa.findOneAndUpdate({ slug }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!visa) {
    return next(new AppError('No visa found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Visa updated successfully',
    data: { visa },
  });
});

exports.deleteVisa = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const visa = await Visa.findOneAndDelete({ slug });

  if (!visa) {
    return next(new AppError('No visa found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Visa deleted successfully',
    data: null,
  });
});
