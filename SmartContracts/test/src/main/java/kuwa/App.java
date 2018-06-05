package kuwa;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.http.HttpService;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args ) throws Exception
    {

        Web3j web3 = Web3j.build(new HttpService("https://rinkeby.infura.io/8Dx9RdhjqIl1y3EQzQpl"));

        Web3ClientVersion clientVersion = web3.web3ClientVersion().sendAsync().get();
        System.out.println("Client version: " + clientVersion.getWeb3ClientVersion());
    }
}
