const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const shortcode = "08000428854";
const phoneNumber = "243815911930";
const currency = "USD"; // Devise du paiement
const mpesaBaseURL = "https://sandbox.vm.co.mz";
const consumerKey = "VOTRE_CONSUMER_KEY";
const consumerSecret = "VOTRE_CONSUMER_SECRET";

app.post("/pay", async (req, res) => {
  const amount = req.body.amount || "1";
  const phone = req.body.phoneNumber || phoneNumber;

  // Simulation du traitement
  res.send(`Paiement de ${amount} ${currency} initié pour ${phone}`);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
