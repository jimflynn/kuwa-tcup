package org.kuwa;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;

import org.web3j.crypto.CipherException;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.admin.Admin;
import org.web3j.protocol.admin.methods.response.NewAccountIdentifier;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.tx.gas.DefaultGasProvider;


/* Class storing the information necessary to load an existing smart contract */
public class ContractInfo {

    private String contractAddress;   // hardcoded for now. how to get it dynamically?
    public final Web3j web3j;
    private Credentials credentials;
    private BigInteger gasPrice = DefaultGasProvider.GAS_PRICE;   // do we pay gas? sponsor should pay the gas
    private BigInteger gasLimit = DefaultGasProvider.GAS_LIMIT;

    public ContractInfo(/*String contractAddress, */String ethNetworkUrl) {
        //this.contractAddress = contractAddress;
        this.web3j = Web3j.build(new HttpService(ethNetworkUrl));
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public static Credentials loadCredentials(String password, String pathToWalletFile) {
        Credentials credentials = null;
        try {
            credentials = WalletUtils.loadCredentials(password, pathToWalletFile);
        }
        catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        catch (CipherException e) {
            e.printStackTrace();
            return null;
        }

        return credentials;
    }

    /* Does not work... */
    public String createAccount(String password) throws IOException {
        Admin admin = Admin.build(new HttpService("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));
        System.out.println(admin.web3ClientVersion());
        NewAccountIdentifier newAccountIdentifier = admin.personalNewAccount(password).send();
        admin.shutdown();
        return newAccountIdentifier.getAccountId(); // Returns the address of the new account
    }

    public String createNewWallet(String password, String filePath) {
        String filename = null;
        try {
            filename = WalletUtils.generateNewWalletFile(password, new File(filePath), false);
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        catch (NoSuchProviderException e) {
            e.printStackTrace();
        }
        catch (InvalidAlgorithmParameterException e) {
            e.printStackTrace();
        }
        catch (CipherException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return filename;
    }

    public BigInteger getGasPrice() {
        return gasPrice;
    }

    public void setGasPrice(BigInteger gasPrice) {
        this.gasPrice = gasPrice;
    }

    public BigInteger getGasLimit() {
        return gasLimit;
    }

    public void setGasLimit(BigInteger gasLimit) {
        this.gasLimit = gasLimit;
    }
}