const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { Country } = require('../models');


const createCountryList = async (payload) => {
  console.log("countryList:", payload);
  try {
    for (let countryData of payload) {
      // Check if a country with the same Ticker already exists
      const existingCountry = await Country.findOne({ Ticker: countryData.Ticker });
      if (existingCountry) {
        console.log("Duplicate Ticker found. Skipping creation:", countryData.Ticker);
        continue; // Skip creation if duplicate Ticker is found
      }
      
      const countryList = await Country.create(countryData);
      console.log("Payload", countryData);
      if (!countryList) {
        throw new Error();
      }
      
      console.log("Executed successfully", countryList);
      continue;
      
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Failed to create country list');
  }
};



const getAllGainLoses = async () => {
  try {
    const getAllGainLoses = await Country.find({});

    const modifiedStocks = [];

    for (const stock of getAllGainLoses) {
      const symbol = stock.Ticker;
      // const apiURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=V8LFR1LC0HSIZFHY`;

      const fetchedData = [];


      const apiURLs = [
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=V8LFR1LC0HSIZFHY`,
        `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=V8LFR1LC0HSIZFHY`,
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=V8LFR1LC0HSIZFHY `,
      ];

      for (const apiUrl of apiURLs) {
        const response = await axios.get(apiUrl);
        console.log("response.data", response.data)
        fetchedData.push(response.data);
      }

      // const response = await axios.get(apiURL);
      // const data = response.data;

      // // Extract desired properties from Alpha Vantage response
      // const { Symbol, AssetType } = data;
      // console.log("data:", data)
      // console.log("stock:", stock)

      // Append fetched data to the stock object
      const modifiedStock = {
        ...stock._doc,
        fetchedData
        // Symbol,
        // AssetType
        // AssetType,
        // PERatio,
        // Add more properties if needed
        // ...otherData
      };
      console.log("modifiedStock", modifiedStock)
      modifiedStocks.push(modifiedStock);
    }

    return modifiedStocks;

    // return getAllGainLoses
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Failed to get country list');
  }
};

module.exports = {
  createCountryList,
  getAllGainLoses
};
