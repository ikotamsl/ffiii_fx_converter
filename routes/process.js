require("dotenv").config();
var express = require("express");
var router = express.Router();
const https = require("https");
const { DateTime } = require("luxon");

/* POST Firefly III Webhook. */
router.post("/", function (req, res, next) {
  console.log(req.body.content);

  const callTransactionCreate = () => {
    if (req.body.content && req.body.content.transactions[0].foreign_amount) {
      const options = {
        hostname: `${process.env.URL}`,
        path: "/api/v1/transactions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json",
          accept: "application/vnd.api+json"
        }
      };

      const data = JSON.stringify({
        error_if_duplicate_hash: true,
        apply_rules: false,
        fire_webhooks: false,
        group_title: null,
        transactions: [
          {
            type: "withdrawal",
            date: `${DateTime.now().toISO()}`,
            amount: `${req.body.content.transactions[0].foreign_amount}`,
            description: `Budgeting in core currency`,
            budget_id: `${req.body.content.transactions[0].budget_id}`,
            source_id: `${process.env.SOURCE_ID}`
            // destination_id: `${process.env.DESTINATION_ID}`,
          }
        ]
      });

      const f3Req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          console.log("Response:", JSON.parse(responseData));
        });
      });

      f3Req.on("error", (err) => {
        console.error(`Error: ${err.message}`);
      });

      const newData = JSON.stringify({
        error_if_duplicate_hash: true,
        apply_rules: false,
        fire_webhooks: false,
        group_title: null,
        transactions: [
          {
            transaction_journal_id: `${req.body.content.id}`,
            budget_id: null
          }
        ]
      });

      f3CorrectTx = https.request(
        {
          hostname: `${process.env.URL}`,
          path: `/api/v1/transactions/${req.body.content.id}`,
          method: "PUT",
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
            console.log("Update:", JSON.parse(responseData));
          });
        }
      );

      const result = f3Req.write(data);

      f3Req.end();

      f3CorrectTx.write(newData);
      f3CorrectTx.end();

      return result;
    }
  };

  try {
    callTransactionCreate();
  } catch (error) {
    console.log(error);
  }

  res.json({ message: "OK" });
});

module.exports = router;
