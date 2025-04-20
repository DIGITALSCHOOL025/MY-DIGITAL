// index.js (Render backend M-Pesa)
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const baseURL = 'https://sandbox.momodeveloper.mtn.com';
const apiUser = 'TON_API_USER';
const apiKey = 'TA_CLE_API_SANDBOX';
const subscriptionKey = 'TON_SUBSCRIPTION_KEY';
const shortcode = '08000428854';
const callbackURL = 'https://digitalschool025.systeme.io/413723d5';

// Fonction d'authentification pour obtenir le token d'accès
async function getAccessToken() {
  const response = await axios.post(
    `${baseURL}/collection/token/`,
    {},
    {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Authorization': 'Basic ' + Buffer.from(apiUser + ':' + apiKey).toString('base64')
      }
    }
  );
  return response.data.access_token;
}

app.get('/pay', async (req, res) => {
  const montant = req.query.amount || 0.5; // Montant par défaut en USD
  const numeroClient = '243815911930'; // Ton numéro M-Pesa à préremplir automatiquement

  try {
    const token = await getAccessToken();
    const referenceId = Math.floor(Math.random() * 1000000000);

    await axios.post(
      `${baseURL}/collection/v1_0/requesttopay`,
      {
        amount: montant,
        currency: 'USD',
        externalId: referenceId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: numeroClient
        },
        payerMessage: 'Paiement Digital School',
        payeeNote: 'Merci pour votre achat'
      },
      {
        headers: {
          'X-Reference-Id': referenceId,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Redirection après paiement (simulé ici)
    return res.redirect(callbackURL);
  } catch (error) {
    console.error('Erreur de paiement M-Pesa :', error.message);
    return res.status(500).send('Erreur lors du traitement du paiement.');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend M-Pesa lancé sur le port ${PORT}`);
});
