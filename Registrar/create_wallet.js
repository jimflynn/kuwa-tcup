////////////////////////////////////////
// Create a wallet for the registrar. //
////////////////////////////////////////

const keythereum = require("keythereum");

const params = {
	keyBytes: 32,
	ivBytes: 16
};

const dk = keythereum.create(params);

const password = "wheethereum";
const kdf = "pbkdf2";

const options = {
	kdf: "pbkdf2",
	cipher: "aes-128-ctr",
	kdfparams: {
		c: 262144,
		dklen: 32,
		prf: "hmac-sha256"
	}
};

const keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
keythereum.exportToFile(keyObject);
