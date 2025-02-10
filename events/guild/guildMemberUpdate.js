const { saveUsernameChange } = require('../utils/api');

module.exports = async (client, oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
        await saveUsernameChange(newMember.user.id, newMember.nickname || newMember.user.username, 'Changement de pseudo serveur');
    }
};
