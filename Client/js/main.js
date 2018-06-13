// NOTE: Each developer who updates this file should add their name to the author list. -->
// Created by The Kuwa Foundation, Inc. (kuwa.org) - Hrishikesh Kashyap, Jim Flynn

//generates a new wallet for the user
function generateKeystore(password, callBack) {
        
        //defining parameters and options to create an ethereum wallet
        var params = { keyBytes: 32, ivBytes: 16 };
        var dk = keythereum.create(params);
        
        var kdf = "pbkdf2"; // or "scrypt" to use the scrypt kdf
        
        var options = {
          kdf: "pbkdf2",
          cipher: "aes-128-ctr",
          kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
          }
        };
	//The key object is generated using a combination of the password and private key. 
        keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, callBack); 
}

function processKeyGeneration()
{
	var password = $('#password').val();
	if ( password == '' ) {
		alert("Please specify a password to protect your private key.");
		return;
	}
	$("#loading").show();
	generateKeystore(password, processKeystore);
}

function processKeystore(keyObject)
{
	if ( !keyObject ) {
		$("#loading").hide();
		alert("An error occurred when generating keys.");
		return;
	}
	$('#address').val(keyObject.address);
	keythereum.recover($('#password').val(), keyObject, showRegistrationRequest);
}

function showRegistrationRequest(privateKey) {
	if ( !privateKey ) {
		alert("An error occurred when recovering private key.");
		return;
	}
	//TODO: Call Sponsor to get (1) a challenge phrase; (2) a KuwaRegistion contract's address; and (2) the contract's ABI.
	//TODO: Record a video of the registrant speaking the challenge phrase.	
	//The recovered private key will be in buffer and must be converted to Hex for readability.
	$('#private-key').text( privateKey.toString('hex') );
	$('#private-key-section').show();
	$('#registration-info').show();
}

function togglePassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
