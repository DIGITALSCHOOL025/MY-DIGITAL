const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Paiement M-Pesa</title></head>
      <body style="text-align: center; padding-top: 50px;">
        <h2>Cliquer pour payer avec M-Pesa</h2>
        <form action="/pay" method="post">
          <button type="submit" style="padding: 15px 30px; font-size: 18px;">Payer maintenant</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/pay", async (req, res) => {
  try {
    // Remplace ces valeurs par celles de ton compte sandbox M-Pesa
    const shortcode = "600100"; // Ton shortcode Sandbox
    const consumerKey = "TA_CONSUMER_KEY";
    const consumerSecret = "TON_CONSUMER_SECRET";
    const partyA = "NUMERO_CLIENT"; // exemple : 254708374149
    const callbackUrl = "https://ton-lien-systeme.io/page-de-remerciement";
    const passkey = "TA_PASSKEY";

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    // Obtenir access token
    const { data: tokenRes } = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });

    const accessToken = tokenRes.access_token;

    // Horodatage au format requis
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Effectuer la demande STK Push
    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: partyA,
        PartyB: shortcode,
        PhoneNumber: partyA,
        CallBackURL: callbackUrl,
        AccountReference: "PaiementTest",
        TransactionDesc: "Paiement via Systeme.io",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.send("Demande de paiement envoyée. Vérifiez votre téléphone M-Pesa !");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur lors du paiement.");
  }
});

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
