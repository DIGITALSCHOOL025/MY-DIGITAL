const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/mpesa-payment', async (req, res) => {
  const { phoneNumber, amount } = req.body;

  try {
    // Exemple d’appel vers l’API M-Pesa
    const response = await axios.post('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      // Données de la requête à adapter selon M-Pesa RDC
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
