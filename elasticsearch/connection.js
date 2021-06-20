const { Client } = require("@elastic/elasticsearch");

var client = new Client({
  cloud: {
    id: "i-o-optimized-deployment:dXMtd2VzdDEuZ2NwLmNsb3VkLmVzLmlvJDVlNzFiNjFlZjlhYjRiMzliMzk1ZGE0ODdhNDc5NTI4JDFhNmQ5MTY2ZDJjNzQ3MTg4YWRkMmE5YjMyZjMyYTc5",
  },
  auth: {
    username: "elastic",
    password: "YjZUTW4W5QhnK6GNXgRZ",
  },
});

module.exports = client;
