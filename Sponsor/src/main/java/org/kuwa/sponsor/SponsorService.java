/*
This class runs as a RESTful web service.

It asks the client for its public key and a shared secret key. Then, it validates the shared secret,
and if the shared secret is valid, it calls a function to fund a request from the client.

TO-DO:
1. Sponsor's shared secret and wallet credentials are in hard-coded locations as of now,
   needs to be changed in the future.

2. As of week 2, the smart contract has yet to implement the sponsorClient() method,
   so final testing cannot be performed. Instead, various other methods have been tested.

3. The address of the Kuwa Token will need to change in the future as the internals of the smart contract change.

4. As of now, the sponsor sends 0.25 fake Ether (fake ether obtained from https://www.rinkeby.io/#faucet).

5. The sponsor sends Ether as of now, NOT KuwaCoins or KuwaTokens. This may or may not need to be changed later.

6. The wallet activity can be checked at:
   https://rinkeby.etherscan.io/address/0xf624465c848f64c8d0dc4b3879c8ad210e00a095
 */

package org.kuwa.sponsor;

import kuwa.KuwaToken;

import org.json.JSONObject;

import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.http.HttpService;

import static org.web3j.tx.Transfer.GAS_LIMIT;
import static org.web3j.tx.gas.DefaultGasProvider.GAS_PRICE;

import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Properties;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.web3j.tx.Transfer;
import org.web3j.utils.Convert;

@Path("/sponsor")
public class SponsorService {

    @POST
    @Path("/request")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public Response sponsorResponse(
            @FormDataParam("public_key") String PK,
            @FormDataParam("shared_secret") String SS) {
        Properties prop = new Properties();
        InputStream input = null;
        String shared_secret = "";

        try {
            input = new FileInputStream("/home/darshi/Kuwa/Sponsor/src/main/resources/Sponsor.properties");
            prop.load(input);
            shared_secret = prop.getProperty("SS");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        if(!SS.equals(shared_secret))
            return Response
                    .status(200)
                    .entity(getResponse(
                            false,
                            "Your Shared Secret is invalid. Please try again."))
                    .build();
        else {

            // call smart contract
            fund_request(PK);
            return Response
                    .status(200)
                    .entity(getResponse(
                            true,
                            "Your request was successfully submitted."))
                    .build();
        }
    }

    private String getResponse(Boolean success, String message) {
        JSONObject obj = new JSONObject();
        obj.put("result", success);
        obj.put("status_message", message);
        return obj.toString();
    }

    private void fund_request(String pub_key) {

        if(!pub_key.startsWith("0x")) {
            pub_key = "0x" + pub_key;
        }

        Web3j web3 = Web3j.build(new HttpService("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

        try {
            // Wallet was created using this command
            /*
            String password = "SponsorPassword";
            String walletFileName = WalletUtils.generateFullNewWalletFile(
                    password,
                    new File("/home/darshi/Kuwa/Sponsor/src/main/resources/"));
            */

            Credentials sponsor_creds = WalletUtils.loadCredentials(
                    "SponsorPassword",
                    new File("/home/darshi/Kuwa/Sponsor/src/main/resources/SponsorWalletCredentials.json"));

            EthGetBalance ethGetBalance_before;
            ethGetBalance_before = web3
                    .ethGetBalance("0xf624465c848f64c8d0dc4b3879c8ad210e00a095",
                            DefaultBlockParameterName.LATEST)
                    .sendAsync()
                    .get();

            BigInteger wei_before = ethGetBalance_before.getBalance();
            System.out.println("Available Wei before sponsoring the client = " + wei_before);

            KuwaToken contract = KuwaToken.load(
                    "0xf624465c848f64c8d0dc4b3879c8ad210e00a095",
                    web3,
                    sponsor_creds,
                    GAS_PRICE,
                    GAS_LIMIT);

            String address = contract.getContractAddress();
            System.out.println("Kuwa Contract resides at: " + address);

            Transfer.sendFunds(
                    web3, sponsor_creds,
                    pub_key,
                    BigDecimal.valueOf(0.25),
                    Convert.Unit.ETHER).sendAsync().get();

            EthGetBalance ethGetBalance_after;
            ethGetBalance_after = web3
                    .ethGetBalance("0xf624465c848f64c8d0dc4b3879c8ad210e00a095",
                            DefaultBlockParameterName.LATEST)
                    .sendAsync()
                    .get();

            BigInteger wei_after = ethGetBalance_after.getBalance();
            System.out.println("Available Wei after sponsoring the client = " + wei_after);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
