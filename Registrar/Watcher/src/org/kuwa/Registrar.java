package org.kuwa;

import org.kuwa.KuwaToken;
import org.kuwa.ContractInfo;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

/* The Registrar class that will call methods on the smart contract */
public class Registrar {

    private KuwaToken contract;

    public Registrar() {}

    public Registrar(ContractInfo contractInfo) {
        loadContract(contractInfo);
    }

    public int getRegistrationStatus(String publicKey)
    {
        BigInteger status;

        try {
            status = contract.getRegistrationStatus(publicKey).send();
        }
        catch (Exception e) {
            e.printStackTrace();
            status = BigInteger.valueOf(-1);
        }

        return status.intValue();
    }

    public void validateRegistration(String publicKey)
    {
        TransactionReceipt receipt = null;
        try {
            receipt = contract.markAsValid(publicKey).send();
        }
        catch (Exception e) {
            e.printStackTrace();
            return;
        }

        if (receipt != null && Integer.decode(receipt.getStatus()) != 0) {
            // Transaction successful. Validation successful.
            System.out.println("Validation success!");
        }
        else {
            // Transaction failed. Failed to validate registration.
            System.out.println("Validation failed!");
        }
    }

    public boolean isValidContract() throws IOException
    {
        return contract.isValid();
    }

    public KuwaToken getContract() {
        return contract;
    }

    public void loadContract(ContractInfo contractInfo)
    {
        contract = KuwaToken.load(contractInfo.getContractAddress(), contractInfo.web3j,
                                    contractInfo.getCredentials(), contractInfo.getGasPrice(),
                                    contractInfo.getGasLimit());
    }


    /* For testing */
    public static void main(String[] args) throws Exception {
        String kuwaContractAddress = "0xe33829f3ddae90b355f1bf6c96bb3149c2c4e9b6";
        String ethNetworkUrl = "https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl";
        String password = "tcup";
        String filePath = "/home/jun/Documents/tcup/Registrar/Watcher/src/org/kuwa/wallet";
        String pathToWalletFile = "";

        ContractInfo contractInfo = new ContractInfo(ethNetworkUrl);
        contractInfo.setContractAddress(kuwaContractAddress);

        File file = new File(filePath);
        System.out.println(file.getAbsolutePath());
        if (file.list().length == 0) {
            pathToWalletFile = contractInfo.createNewWallet(password, filePath);
        }
        else {
            pathToWalletFile = file.list()[0];
        }

        Credentials credentials = ContractInfo.loadCredentials(password, filePath + '/' + pathToWalletFile);

        System.out.println(credentials.getAddress());
        contractInfo.setCredentials(credentials);
        Web3ClientVersion web3ClientVersion = contractInfo.web3j.web3ClientVersion().send();
        String clientVersion = web3ClientVersion.getWeb3ClientVersion();
        System.out.println(clientVersion);

        Registrar registrar = new Registrar();
        registrar.loadContract(contractInfo);
        System.out.println(registrar.getContract().getContractAddress());

        // Call smart contract functions...
        System.out.println(registrar.isValidContract());
        System.out.println(registrar.getRegistrationStatus(credentials.getEcKeyPair().getPublicKey().toString()));
        registrar.validateRegistration(credentials.getEcKeyPair().getPublicKey().toString());
    }
}