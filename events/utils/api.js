const axios = require('axios');
require('dotenv').config();

async function saveUsernameChange(userId, newName, type) {
    try {
        const response = await axios.post(`${process.env.API_URL}/api/prevnames-add`, {
            userId: userId,
            newName: newName,
            type: type
        });

        if (response.data.success) {
            console.log(`Pseudo ${newName} ajouté pour l'utilisateur ${userId}.`);
        } else {
            console.log(`Erreur lors de l'ajout du pseudo pour l'utilisateur ${userId}: ${response.data.message}`);
        }
    } catch (error) {
        console.error('Erreur lors de la requête API:', error);
    }
}

module.exports = { saveUsernameChange };
