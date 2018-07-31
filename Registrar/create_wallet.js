var keythereum = require("keythereum");
var params = { keyBytes: 32, ivBytes: 16 };// synchronous
var dk = keythereum.create(params);

// dk:
// {
//   privateKey: <Buffer ...>,
//   iv: <Buffer ...>,
//   salt: <Buffer ...>
// }

var password = "wheethereum";
var kdf = "pbkdf2";

var options = {
kdf: "pbkdf2",
cipher: "aes-128-ctr",
kdfparams: {
  c: 262144,
  dklen: 32,
  prf: "hmac-sha256"
  }
};// synchronous

var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
keythereum.exportToFile(keyObject);
