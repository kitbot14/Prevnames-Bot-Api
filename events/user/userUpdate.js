const { saveUsernameChange } = require('../utils/api');

module.exports = async (client, oldUser, newUser) => {
    if (oldUser.username !== newUser.username) {
        await saveUsernameChange(newUser.id, newUser.username, 'Changement de pseudo compte');
    }
};
