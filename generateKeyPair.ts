import * as crypto from 'crypto';
import * as fs from 'fs';

const keyPair = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
});

fs.writeFileSync(`${__dirname}/jwt_RS256_key.pem`, keyPair.publicKey);

fs.writeFileSync(`${__dirname}/jwt_RS256_key_pub.pem`, keyPair.privateKey);
