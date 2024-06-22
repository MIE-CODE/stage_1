const express = require("express");
const cors = require("cors");
const os = require("os");

const app = express();
const port = 5050;
app.use(cors("*"));

// get ip address
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "IP address not found";
};

app.get("/api/hello", (req, res) => {
  const ip = getLocalIpAddress();
  const { visitor_name } = req.query;
  res.send({ client_ip: ip, greeting: `Hello ${visitor_name}!` });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}...`);
});
