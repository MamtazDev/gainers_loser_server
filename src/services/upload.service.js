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

// const getAllGainLoses = async () => {
//   try {
//     const getAllGainLoses = await Country.find({});

//     const modifiedStocks = [];
//     const apiKey = "PX3USK5O28KQACMI"

//     for (const stock of getAllGainLoses) {
//       const symbol = stock.Ticker;
//       // const apiURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=V8LFR1LC0HSIZFHY`;

//       const fetchedData = [];

//       const apiURLs = [
//         `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`,           
//         `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${apiKey}`,
//         // `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey} `,  
//       ]; 

//       for (const apiUrl of apiURLs) {
//         const response = await axios.get(apiUrl);
//         console.log("response.data", response.data)
//         fetchedData.push(response.data);
//       }

//       // const response = await axios.get(apiURL);
//       // const data = response.data;

//       // // Extract desired properties from Alpha Vantage response
//       // const { Symbol, AssetType } = data;
//       // console.log("data:", data)
//       // console.log("stock:", stock)

//       // Append fetched data to the stock object
//       const modifiedStock = {
//         ...stock._doc,
//         fetchedData
//         // Symbol,
//         // AssetType
//         // AssetType,
//         // PERatio,
//         // Add more properties if needed
//         // ...otherData
//       };
//       // console.log("modifiedStock", fetchedData)
//       modifiedStocks.push(modifiedStock);
//     }

//     return modifiedStocks;

//     // return getAllGainLoses
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Failed to get country list');
//   }
// };


const apiKey = "PX3USK5O28KQACMI";
const baseURL = "https://www.alphavantage.co/query";

const alphaVantageAPI = axios.create({
  baseURL,
  params: {
    apikey: apiKey
  }
});

const getAllGainLoses = async (req, res) => {
  try {
    const getAllGainLoses = await Country.find({}).lean(); // Use lean() to return plain JS objects

    const modifiedStocks = await Promise.all(getAllGainLoses.map(async (stock) => {
      const symbol = stock.Ticker;
      const apiURLs = [
        `/query?function=OVERVIEW&symbol=${symbol}`,
        `/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}`
        // Add more endpoints if needed
      ];

      const fetchedData = await Promise.all(apiURLs.map(async (apiURL) => {
        try {
          const response = await alphaVantageAPI.get(apiURL);
          return response.data;
        } catch (error) {
          console.error("Error fetching data:", error);
          return null; // Or handle error as needed
        }
      }));

      const modifiedStock = {
        ...stock,
        fetchedData
        // Add more properties if needed
      };
      return modifiedStock;
    }));

    res.json(modifiedStocks); // Return modified stocks as JSON response

  } catch (error) {
    console.error("Failed to get country list:", error);
    res.status(500).json({ error: "Failed to get country list" }); // Send appropriate error response
  }
};

module.exports = {
  createCountryList,
  getAllGainLoses
};
