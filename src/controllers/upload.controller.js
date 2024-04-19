const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { uplaodService } = require('../services');

const countryList = catchAsync(async (req, res) => {
  // console.log("req.body", req.body)
  const countryList = await uplaodService.createCountryList(req.body);

  res.status(httpStatus.CREATED).send({ countryList });
});


const GainLoses = catchAsync(async (_req, res) => {
  const modifiedStocks = await uplaodService.getAllGainLoses();


  
  res.status(httpStatus.CREATED).send({ getAllGainLoses: modifiedStocks.length, Data: modifiedStocks });
});


module.exports = {
  countryList,
  GainLoses
};
