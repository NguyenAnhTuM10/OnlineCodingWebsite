const bcrypt = require('bcryptjs');

const plain = '123456';
const hash1 = bcrypt.hashSync(plain, 10);
const hash2 = bcrypt.hashSync(plain, 10);

console.log('Hash 1:', hash1);
console.log('Hash 2:', hash2);

bcrypt.compare(plain, hash1).then(res => console.log('Match 1:', res));
bcrypt.compare(plain, hash2).then(res => console.log('Match 2:', res));
