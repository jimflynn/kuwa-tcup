<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Basic Income Wallet</title>
  <!-- Favicons for various platforms -->
  <link rel="apple-touch-icon" sizes="180x180" href="image/fav/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="image/fav/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="image/fav/favicon-16x16.png">
  <link rel="manifest" href="image/fav/site.webmanifest">
  <link rel="mask-icon" href="image/fav/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="Basic Kuwa Faucet Demo">
  <meta name="author" content="Jim Flynn, The Kuwa Foundation, Inc.">
  <link rel="stylesheet" href="css/main.css" type="text/css" />
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="js/qrcode.js"></script>
  <script src="js/basicIncomeFunctions.js"></script>
  <script>
  $(document).ready(function() {
    initializePage();
    var kuwaID = "<?php echo $_GET['kuwaid'] ?>";
    if (kuwaID == '' ) {
      kuwaID = getStoredKuwaID();
    }

    if ( isAddress(kuwaID) ) {
      processKuwaId( kuwaID );
    }
    else {
      processMissingKuwaID();
    }
    //showPopUp();
  });
  </script>
</head>
<body style="background-color: #000;">

	<div style="display: block; width: 100%;">
		<a href="/" class="brightLink">TCUP Home Page</a>
		<div class="main_container">
			<div class="main_content">
				<div class="left_panel">
					<img src="image/basic-income.png" style="margin: auto; display: block"/>
				</div>
				<div class="right_panel">
					<div id="wallet_form" class="info_form">
						<h2 class="leftJust">Your Kuwa Credentials:</h2>
						<div id="qrcode"></div>
						<p class="subtext">Kuwa ID: <a href="" target="_blank" id="qrtext" class="set"></a><span class="not_set">[NOT SET]</span></p>
						<p class="subtext">Contract: <a href="" target="_blank" id="contractAddress" class="set"></a><span class="not_set">[NOT SET]</span></p>
            <div id="details">
  						<p class="link subtext" style="display: none;">Download Your Encrypted Private Key</p>
  						<h2>KuwaCoin Balance: <span id="balance"></span> KC</h2>
  						<p class="leftJust">Next Payment: midnight tonight (USA Eastern Time)</p>
  						<p class="leftJust">
  							<strong>NOTE:</strong> You can <a target="_blank" href="/instructions/adding-kuwacoin-to-metamask.html">add KuwaCoin to MetaMask</a>.
  						</p>
              <button onclick="JavaScript: forgetKuwaID();">Clear Kuwa ID</button>
            </div>
            <div id="getID">
              <h3>No Kuwa ID detected.</h3>
              <h3>Click <a href="/client/">here</a> to get a Kuwa ID.</h3>
              <strong>Or enter a Kuwa ID: </strong>
              <input id="enteredID" type="text" />
              <button onclick="JavaScript: processKuwaId( $('#enteredID').val());">Go</button>
            </div>
					</div>
				</div>
			</div>
		</div> <!-- END main_container -->
  </div>

  <div id="loading" class="dark_bg"></div>

  <div id="dark_page" class="dark_bg"></div>

  <div class="popup">
    <div class="wrapper" style="float: left;">
      <img src="image/close.png" id="close_button" onclick="JavaScript: hidePopUp();" />
      <div style="width: 40%; float: left;">
        <img src="image/party.png" class="mode_image" />
      </div>
      <div style="display: content; color: #FFF; margin-right: 15px;">
        <h2>Congratulations!</h2>
        <p>
          You will get a basic income payment of one KuwaCoin every day.
        </p>
        <p class="extra_message" style="display: block;">
          We noticed that your account balance is zero.
          So we already sent you a KuwaCoin. Enjoy!
        </p>
        <div style="width: 100%; display: block; float: left;">
          <button class="popup_button" onclick="JavaScript: hidePopUp();" style="width: auto; display: block; margin: 5px auto 10px auto; padding: 2px 5px 2px 5px;">OK</button>
        </div>
      </div>
     </div>
  </div>

	<div class="footer_container">
		<div>
			<p>
				<hr/>
				<a class="brightLink" href="http://kuwa.org" target="_blank">The Kuwa Foundation, Inc.</a> created this site in 2018.
			</p>
			<p>
				KuwaToken, KuwaCoin, and Kuwa Platform are trademarks of The Kuwa Foundation, Inc.
			</p>
		</div>
</div> <!-- END footer_container -->

</body>
</html>
