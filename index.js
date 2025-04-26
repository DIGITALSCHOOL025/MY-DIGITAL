// 1. Installe d'abord express et axios si pas encore fait
// npm install express axios

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Remplacer par TES vraies infos CinetPay
const API_KEY = '1566511865680bd456ab25f7.01839391';
const SITE_ID = '105893277';
const RETURN_URL_SUCCESS = 'https://digitalschool025.systeme.io/413723d5';
const RETURN_URL_FAILED = 'https://ton-site.systeme.io/page-echec';

app.get('/initier-paiement', async (req, res) => {
  try {
    // Générer un ID de transaction unique
    const transaction_id = 'txn_' + Date.now();

    // Construction du corps de la requête
    const paiementData = {
      apikey: API_KEY,
      site_id: SITE_ID,
      transaction_id: transaction_id,
      amount: 500, // Montant en FCFA ou CDF
      currency: 'CDF', // ou 'CDF' selon ton pays
      description: 'Paiement pour formation',
      return_url: `${process.env.BASE_URL}/verification-paiement?transaction_id=${transaction_id}`,
      notify_url: '', // Optionnel si tu veux gérer des notifications serveur
      customer_name: 'LAURENT',
      customer_surname: 'MAMBA',
      customer_email: 'mambalaurent009@exemple.com',
      customer_phone_number: '243816366576', // Format international
      customer_address: 'Mbujimay, République Démocratique du Congo',
      customer_city: 'Mbujimayi',
      customer_country: 'RDC',
      channels: 'ALL',
      metadata: '{}'
    };

    // Appel API CinetPay pour générer une URL de paiement
    const response = await axios.post('https://api-checkout.cinetpay.com/v2/payment', paiementData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.code === '201') {
      // Paiement lancé : rediriger vers la page de paiement CinetPay
      const payment_url = response.data.data.payment_url;
      return res.redirect(payment_url);
    } else {
      return res.send('Erreur lors de la création du paiement : ' + response.data.message);
    }

  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Route de vérification du paiement après retour
app.get('/verification-paiement', async (req, res) => {
  const { transaction_id } = req.query;

  try {
    // Vérifier l'état du paiement via CinetPay
    const verificationResponse = await axios.post('https://api-checkout.cinetpay.com/v2/payment/check', {
      apikey: API_KEY,
      site_id: SITE_ID,
      transaction_id: transaction_id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const paiementStatus = verificationResponse.data.data.status;

    if (paiementStatus === 'ACCEPTED') {
      // Paiement accepté
      return res.redirect(RETURN_URL_SUCCESS);
    } else {
      // Paiement refusé ou échec
      return res.redirect(RETURN_URL_FAILED);
    }

  } catch (error) {
    console.error('Erreur de vérification:', error);
    return res.redirect(RETURN_URL_FAILED);
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en marche sur http://localhost:${PORT}`);
});
