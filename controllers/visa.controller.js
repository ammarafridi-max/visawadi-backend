const catchAsync = require('../utils/catchAsync');
const Visa = require('../models/Visa');
const AppError = require('../utils/appError');

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
