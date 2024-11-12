const https = require("https");

const currencyExchange = async (from, to) => {
  if (!process.env.EXCHANGE_API_ENABLED) {
    console.log(
      "Exchange API is not enabled, conversion should be done manually"
    );
    return null;
  }

  try {
    const options = {
      hostname: `v6.exchangerate-api.com`,
      path: `/v6/${process.env.EXCHANGE_API_KEY}/pair/${from}/${to}`,
      method: "GET",
      headers: {
        Connection: "keep-alive"
      }
    };

    const body = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = "";

        res.on("data", (chunk) => {
          chunks += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(chunks));
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.end();
    });

    return body;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { currencyExchange };
