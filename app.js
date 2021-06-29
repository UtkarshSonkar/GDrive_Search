const express = require("express");
const formData = require("express-form-data");
const client = require("./elasticsearch/connection");
const path = require("path");
//const fs = require("fs");
//const readline = require("readline");

//Import Routes Here
const data = require("./routes/api/data");

client.ping(function (error) {
  if (error) {
    console.error("Elasticsearch cluster is down!", error);
  } else {
    console.log("Elasticsearch is connected");
  }
});

const app = express();

//middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse());
//Define Routes
app.use("/api/data", data);

const { google } = require("googleapis");
const OAuth2Data = require("./credentials.json");
const { response } = require("express");

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

var authed = false;

const SCOPES =
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

const TOKEN_PATH = "token.json";

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (!authed) {
    var url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log(url);

    res.render("index.ejs", { url: url });
  } else {
    res.redirect("/api/data/earthquakes");

    var oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    oauth2.userinfo.get(function (err, response) {
      if (err) throw error;

      console.log(response.data);
    });
  }
});

app.get("/google/callback", (req, res) => {
  const code = req.query.code;

  if (code) {
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error in Authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        console.log(tokens);
        oAuth2Client.setCredentials(tokens);

        authed = true;

        res.redirect("/");
      }
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`  Server Started On ${PORT}`));

/*app.listen(5000, () => {
  console.log("server is on port 5000");
});*/

/**/
