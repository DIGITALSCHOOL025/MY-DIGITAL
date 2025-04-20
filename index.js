// backend M-Pesa sandbox (Node.js)
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Infos sandbox
const shortcode = "08000428854"; // shortcode marchand
const consumerKey = "SANDBOX_CONSUMER_KEY_ICI";
const consumerSecret = "SANDBOX_CONSUMER_SECRET_ICI";
const baseURL = "https://sandbox.vm.co.mz"; // base URL sandbox M-Pesa

// Obtenir token d'accès
async function getAccessToken() {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const config = {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  };

  const response = await axios.get(`${baseURL}/ipg/v1/oauth/token`, config);
  return response.data.access_token;
}

// Lancer paiement
app.post("/pay", async (req, res) => {
  const { amount, phoneNumber } = req.body;
  try {
    const token = await getAccessToken();

    const payload = {
      input_Amount: amount,
      input_CustomerMSISDN: phoneNumber,
      input_ServiceProviderCode: shortcode,
      input_ThirdPartyReference: "Ref123456", // identifiant unique pour la transaction
      input_TransactionReference: "Txn123456", // identifiant transaction
    };

    const response = await axios.post(
      `${baseURL}/ipg/v1/c2bPayment/singleStage/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Paiement lancé", data: response.data });
  } catch (error) {
    console.error("Erreur paiement:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Paiement échoué", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur M-Pesa sandbox en cours sur le port ${port}`);
});
