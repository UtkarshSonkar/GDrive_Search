require("log-timestamp");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const client = require("../../elasticsearch/connection");

const app = express();

app.set("view engine", "ejs");

//This URL will be changed in future to fetch Google drive files in JSON format
const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`;
const URLs = axios.get(`${URL}`, {
  headers: {
    "Content-Type": ["application/json", "charset=utf-8"],
  },
});

router.get("/earthquakes", async function (req, res) {
  console.log("Loading Application...");

  //======= Check that Elasticsearch is up and running =======\\

  setInterval(() => {
    pingElasticsearch = async () => {
      await client.ping(function (error, res) {
        if (error) {
          console.error("elasticsearch cluster is down!");
        } else {
          console.log("Elasticsearch Ready");
        }
      });
    };

    //Declare

    // ====== Get Data From USGS and then index into Elasticsearch

    var indexcheck = false;
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

        //console.log(results);
        //res.json(results);

        //start

        results.map(
          async (results) => (
            (earthquakeObject = {
              place: results.properties.place,
              time: results.properties.time,
              tiamp: results.properties.time,
              updmestated: results.properties.updated,
              tz: results.properties.tz,
              url: results.properties.url,
              detail: results.properties.detail,
              felt: results.properties.felt,
              cdi: results.properties.cdi,
              alert: results.properties.alert,
              status: results.properties.status,
              tsunami: results.properties.tsunami,
              sig: results.properties.sig,
              net: results.properties.net,
              code: results.properties.code,
              sources: results.properties.sources,
              nst: results.properties.nst,
              dmin: results.properties.dmin,
              rms: results.properties.rms,
              mag: results.properties.mag,
              magType: results.properties.magType,
              type: results.properties.type,
              latitude: results.geometry.coordinates[0],
              longitude: results.geometry.coordinates[1],
              location: {
                lat: results.geometry.coordinates[1],
                lon: results.geometry.coordinates[0],
              },
              depth: results.geometry.coordinates[2],
            }),
            //res.json(earthquakeObject),
            //console.log(earthquakeObject)

            await client.index({
              index: "earthquakes",
              id: results.id,
              body: earthquakeObject,
            }),
            (err, resp, status) => {
              console.log(resp);
            }
          )
        );
        //stop

        if (EARTHQUAKES.data.length) {
          indexAllDocs();
        } else {
          indexcheck = true;
          console.log("All Data Has Been Indexed!");
          return res.json(results);
        }
      } catch (err) {
        console.log(err);
      }

      console.log("Preparing For The Next Data Check...");
    };

    //searching text
    //pingElasticsearch();
    //indexAllDocs();
    //res.render("success.ejs");
    //searchtext();

    pingElasticsearch();
    indexAllDocs();
    //searchtext();
  }, 12000);
});

module.exports = router;
//module.exports = indexAllDocs();
