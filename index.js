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
const RETURN_URL_FAILED = 'https://digitalschool025.systeme.io/baae8ba1';

app.get('/initier-paiement', async (req, res) => {
  try {
    // Exemple d'appel API avec axios
    const response = await axios.post('https://api.cinetpay.com/v1/payment', {
      api_key: 'VOTRE_API_KEY',  // Remplace par ta clé API
      amount: 100,                // Montant en CFA
      currency: 'CDF',
      payment_method: 'cinetpay',
      return_url: 'https://digitalschool025.systeme.io/413723d5', // Page de remerciement
      cancel_url: 'https://digitalschool025.systeme.io/baae8ba1', // Page d'échec
    });

    // Vérifie que l'URL de paiement est bien présente dans la réponse
    if (response.data && response.data.payment_url) {
      return res.redirect(response.data.payment_url);
    } else {
      return res.status(500).send('Erreur lors de la génération du lien de paiement.');
    }
  } catch (error) {
    console.error('Détails de l\'erreur :', error.message || error); // Afficher le message d'erreur complet
    return res.status(500).send('Erreur interne du serveur.');
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
