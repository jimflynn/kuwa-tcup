function processMissingKuwaID() {
	initializePage();
}

function makeCode (text) {
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 150,
		height : 150
	});

	if (text == '') {
		alert("No QR code");
		return;
	}
	qrcode.makeCode(text);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function processKuwaId(kuwaID) {
	$('#loading').show();
	$.get("https://alpha.kuwa.org:3021/processKuwaID/?kuwaid="+kuwaID, function(data, status) {
        processAPIResponse(data, status);
  });
}

function processAPIResponse(data, status) {
	//alert(data);
	data = JSON.parse(data);
	if ( data.status != 'success' ) {
		var message = null;
		if (data.message) message = data.message;
		if (data.kuwaIDStatus) message = message + ' Kuwa ID status: ' + data.kuwaIDStatus;
		$('#loading').hide();
		showPopUp('api_error_message', message);
		return;
	}
	let kuwaID = data.kuwaID;
	let contractAddress = data.contractAddress;
	let balance = data.kuwaCoinBalance;
	$('#qrtext').text(kuwaID);
	$('#qrtext').attr('href', "https://rinkeby.etherscan.io/address/" + kuwaID + '#tokentxns');
	$('#contractAddress').text(contractAddress);
	$('#contractAddress').attr('href', "https://rinkeby.etherscan.io/address/" + contractAddress);
	$('#balance').text(balance);
	makeCode( kuwaID );
	$('#details').show();
	$('#getID').hide();
	$('.set').show();
	$('.not_set').hide();
	$('#loading').hide();
	storeKuwaID(kuwaID);
	if (data.actions.registered == 'yes') {
		$('.extra_message').hide();
		showPopUp('congrats_message');
		if (data.actions.paid > 0) {
			$('.extra_message').show();
		}
	}
}

function storeKuwaID(kuwaID) {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("kuwaID", kuwaID);
	}
}

function getStoredKuwaID() {
	if (typeof(Storage) !== "undefined") {
		return kuwaID = localStorage.getItem("kuwaID");
	}
}

function hidePopUp() {
	//$('.popup').hide();
	$('#dark_page').hide();
	$('.wrapper').hide();
}

function showPopUp(message_type, extra=null) {
	// message_type: invalid_format_message, congrats_message, api_error_message
	//$('#'+message_type+ ' .extra_message').text('').hide();
	if (extra != null ) {
		$('#'+message_type+ ' .extra_message').text(extra).show();
	}
	$('.popup_content').hide();
	$('#'+message_type).show();
	$('.wrapper').show();
	$('#dark_page').show();
}

function initializePage() {
	$('#qrtext').text('');
	$('#contractAddress').text('');
	$('#balance').text('');
	$('#qrcode').text('');
	$('#details').hide();
	$('#enteredID').val('')
	$('#getID').show();
	$('.set').hide();
	$('.not_set').show();
}

function forgetKuwaID() {
	localStorage.removeItem("kuwaID");
	initializePage();
}

function showKuwaIDNotFoundDialog() {
	alert('in showKuwaIDNotFoundDialog');
}

function showInvalidAddressDialog() {
	alert('in showInvalidAddressDialog');
}

//++++++++ Utility Functions ***************

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};
