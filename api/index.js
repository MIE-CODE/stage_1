const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5050;

app.set("trust proxy", true);

app.use(cors());

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
  const clientIP =
    req.headers["x-vercel-protection-bypass"] ||
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "Unknown";

  console.log("Client IP:", clientIP);

  console.log(clientIP);

  try {
    const response = await axios.get(
      `https://ipinfo.io/json?token=1ace4c41de19a3`
    );
    const location = response.data;

    const main_response = await axios.get(`http://ip-api.com/json/${clientIP}`);
    const { lat, lon, country, city } = main_response.data;

    const weatherApiKey = "9f66f92b6d8a484ba284d271d09bd0f5";

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
    );
    const temperature = weatherResponse.data.main.temp;

    res.send({
      client_ip: location.ip,
      location: country,
      greeting: `Hello ${visitor_name}!, The temperature is ${temperature} degrees Celcius in ${city}`,
    });
  } catch (error) {
    // console.error("Error fetching location or weather data:", error);
    res.status(500).json({ error: "Error fetching location or weather data" });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}...`);
});
