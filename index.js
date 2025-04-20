const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Route de test
app.get("/", (req, res) => {
  res.send("Serveur M-Pesa opérationnel 🚀");
});

// ✅ Route de paiement
app.post("/pay", async (req, res) => {
  try {
    const phoneNumber = "243815911930"; // Ton numéro M-Pesa pour test
    const shortcode = "08000428854"; // Ton shortcode
    const amount = "1"; // En dollar sandbox = 1 USD
    const currency = "USD";

    // 🔐 Authentification (en attente des vraies clés)
    const token = process.env.SANDBOX_API_KEY || "VOTRE_SANDBOX_KEY";

    // 👉 Appel de l'API M-Pesa
    const response = await axios.post(
      "https://sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/",
      {
        input_TransactionReference: `TX-${Date.now()}`,
        input_CustomerMSISDN: phoneNumber,
        input_Amount: amount,
        input_Currency: currency,
        input_ServiceProviderCode: shortcode,
        input_ThirdPartyReference: `REF-${Date.now()}`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Réponse M-Pesa:", response.data);

    // ✅ Redirection vers la page de remerciement après succès
    res.status(200).json({
      success: true,
      message: "Paiement initié avec succès",
      redirectURL: "https://digitalschool025.systeme.io/413723d5" // 🔁 Ta page merci
    });

  } catch (error) {
    console.error("Erreur de paiement M-Pesa:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors du traitement de paiement",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours sur le port ${PORT}`);
});
