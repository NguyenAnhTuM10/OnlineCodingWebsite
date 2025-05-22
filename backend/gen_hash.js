const bcrypt = require('bcryptjs');

const plainPassword = '123456';
const hash = bcrypt.hashSync(plainPassword, 10);

console.log('👉 Bcrypt hash:', hash);
