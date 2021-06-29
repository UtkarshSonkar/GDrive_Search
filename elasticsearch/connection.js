const { Client } = require("@elastic/elasticsearch");

var client = new Client({
  cloud: {
    // id: "i-o-optimized-deployment:dXMtd2VzdDEuZ2NwLmNsb3VkLmVzLmlvJDVlNzFiNjFlZjlhYjRiMzliMzk1ZGE0ODdhNDc5NTI4JDFhNmQ5MTY2ZDJjNzQ3MTg4YWRkMmE5YjMyZjMyYTc5",
    id: "i-o-optimized-deployment:ZWFzdHVzMi5henVyZS5lbGFzdGljLWNsb3VkLmNvbTo5MjQzJDFkZWNhNjBmMWFhODQxNGQ4YjdhMzk5MDQ5YWY4N2JhJDRhZjk2N2Q5YWJlYjRjMjRhMjE0N2E0YjcwYzdmNTZi",
  },
  auth: {
    username: "elastic",
    password: "dz6n28hM1l0fTfXxAJfZS268",
  },
});

module.exports = client;
