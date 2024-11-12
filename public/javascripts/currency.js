const https = require("https");


const currencyExchange = (from, to) => {
  if (!process.env.EXCHANGE_API_ENABLED) {
    console.log("Exchange API is not enabled, conversion should be done manually");
    return null;
  }
    

  const req = https.request(
    {
      hostname: `v6.exchangerate-api.com/v6`,
      path: `/${process.env.EXCHANGE_API_KEY}/pair/${from}/${to}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        "Content-Type": "application/json",
        accept: "application/vnd.api+json"
      }
    },
    (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        console.log("Response:", JSON.parse(responseData));
      });
    }
  );
};
