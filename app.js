const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5050;
app.use(cors("*"));

// middleware to modify response
app.use((req, res, next) => {
  const query = req.query;
  for (let param in query) {
    if (query.hasOwnProperty(param)) {
      query[param] = decodeURIComponent(query[param])
        .replace(/"/g, "")
        .replace(/%20/g, "_");
    }
  }

  next();
});

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  try {
    const response = await axios.get(
      `https://ipinfo.io/json?token=1ace4c41de19a3`
    );
    const location = response.data;

    res.send({
      client_ip: location.ip,
      location: location.country,
      greeting: `Hello ${visitor_name}!, The temperature is 11 degrees Celcius in ${location.country}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching location data" });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}...`);
});
