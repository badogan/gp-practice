const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getIPDetails = catchAsync(async (req, res, next) => {
  if (!req.ipInfo) {
    return next(new AppError('IP details not available', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: req.ipInfo
    }
  });
});
