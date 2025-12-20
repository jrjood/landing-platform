const bcrypt = require('bcrypt');

const password = 'YourSecurePassword123!';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Bcrypt Hash:', hash);
  console.log('\nCopy this hash to your seed.sql file');
});
