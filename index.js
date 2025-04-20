const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const shortcode = "08000428854";
const phoneNumber = "243815911930"; // Pour test
const mpesaBaseURL = "https://sandbox.vm.co.mz"; // M-Pesa Sandbox
const consumerKey = "VOTRE_CONSUMER_KEY"; // À remplacer dès que dispo
const consumerSecret = "VOTRE_CONSUMER_SECRET";

// Route POST /pay
app.post("/pay", async (req, res) => {
  const amount = req.body.amount || "100";
  const phone = req.body.phoneNumber || phoneNumber;

  // Pour test simple : simule une réponse
  res.send(`Paiement de ${amount} CDF initié pour ${phone}`);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
