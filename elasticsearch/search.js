var client = require("./connection.js");
const axios = require("axios");
const { query } = require("express");
//const request = require("request");

//const weatherForm=document.querySelector('form')
//const search=document.querySelector('input')

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`;

searchtext = async (callback) => {
  // console.log("hii");
  const EARTHQUAKES = await axios.get(`${URL}`, {
    headers: {
      "Content-Type": ["application/json", "charset=utf-8"],
    },
  });
  console.log("hii");
  results = EARTHQUAKES.data.features;
  //Query = results.properties;
  //console.log(Query);

  if (!"1km NNE of Loma Linda, CA") {
    callback("Please enter the text...", undefined);
  } else {
    try {
      client.search(
        {
          index: "earthquakes",
          id: results.id,
          body: {
            query: {
              match: { place: "1km NNE of Loma Linda, CA" },
            },
          },
        },
        (error, response, status) => {
          if (error) {
            res.json(400, err);
          } else {
            res.json(200, response.hits.hits);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
};
searchtext();

module.exports = searchtext;
