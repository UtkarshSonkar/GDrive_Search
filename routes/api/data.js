require("log-timestamp");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const client = require("../../elasticsearch/connection");

//This URL will be changed in future to fetch Google drive files in JSON format
const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`;

router.get("/earthquakes", async function (req, res) {
  console.log("Loading Application...");
  res.json("Application Running...");

  //======= Check that Elasticsearch is up and running =======\\
  pingElasticsearch = async () => {
    await client.ping(function (error, res) {
      if (error) {
        console.error("elasticsearch cluster is down!");
      } else {
        console.log("Elasticsearch Ready");
      }
    });
  };

  // ====== Get Data From USGS and then index into Elasticsearch
  indexAllDocs = async () => {
    try {
      console.log("Getting Data From Host");

      const EARTHQUAKES = await axios.get(`${URL}`, {
        headers: {
          "Content-Type": ["application/json", "charset=utf-8"],
        },
      });

      console.log("Data Received!");

      results = EARTHQUAKES.data.features;

      console.log("Indexing Data...");

      console.log(results);
      res.json(results);

      if (EARTHQUAKES.data.length) {
        indexAllDocs();
      } else {
        console.log("All Data Has Been Indexed!");
      }
    } catch (err) {
      console.log(err);
    }

    console.log("Preparing For The Next Data Check...");
  };

  pingElasticsearch();
  indexAllDocs();
});

module.exports = router;
