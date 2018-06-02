package kuwa;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import rx.Observable;
import rx.functions.Func1;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 3.4.0.
 */
public class KuwaToken extends Contract {
    private static final String BINARY = "0x60806040526040805190810160405280600981526020017f4b757761546f6b656e0000000000000000000000000000000000000000000000815250600090805190602001906200005192919062000171565b506040805190810160405280600481526020017f4b75776100000000000000000000000000000000000000000000000000000000815250600190805190602001906200009f92919062000171565b506040805190810160405280600e81526020017f4b757761546f6b656e2076312e3000000000000000000000000000000000000081525060029080519060200190620000ed92919062000171565b50348015620000fb57600080fd5b50604051602080620017928339810180604052810190808051906020019092919050505080600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806003819055505062000220565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001b457805160ff1916838001178555620001e5565b82800160010185558215620001e5579182015b82811115620001e4578251825591602001919060010190620001c7565b5b509050620001f49190620001f8565b5090565b6200021d91905b8082111562000219576000816000905550600101620001ff565b5090565b90565b61156280620002306000396000f3006080604052600436106100db576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100e0578063095ea7b31461017057806318160ddd146101d55780631a593c411461020057806323b872dd146102205780633f4baa1e146102a55780635a3b7e421461032657806370a08231146103b657806375c45d3f1461040d5780638bbfc99e1461048e57806395d89b411461050b578063a9059cbb1461059b578063ab09894514610600578063dd62ed3e14610669578063f06df9f5146106e0575b600080fd5b3480156100ec57600080fd5b506100f561076b565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561013557808201518184015260208101905061011a565b50505050905090810190601f1680156101625780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561017c57600080fd5b506101bb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610809565b604051808215151515815260200191505060405180910390f35b3480156101e157600080fd5b506101ea6108fb565b6040518082815260200191505060405180910390f35b61021e60048036038101908080359060200190929190505050610901565b005b34801561022c57600080fd5b5061028b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061097b565b604051808215151515815260200191505060405180910390f35b3480156102b157600080fd5b5061030c600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610ce2565b604051808215151515815260200191505060405180910390f35b34801561033257600080fd5b5061033b610d7a565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561037b578082015181840152602081019050610360565b50505050905090810190601f1680156103a85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156103c257600080fd5b506103f7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e18565b6040518082815260200191505060405180910390f35b34801561041957600080fd5b50610474600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610e30565b604051808215151515815260200191505060405180910390f35b34801561049a57600080fd5b506104f5600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610ec8565b6040518082815260200191505060405180910390f35b34801561051757600080fd5b50610520610fe1565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610560578082015181840152602081019050610545565b50505050905090810190601f16801561058d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156105a757600080fd5b506105e6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061107f565b604051808215151515815260200191505060405180910390f35b34801561060c57600080fd5b50610667600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611241565b005b34801561067557600080fd5b506106ca600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611350565b6040518082815260200191505060405180910390f35b3480156106ec57600080fd5b50610747600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611375565b6040518082600481111561075757fe5b60ff16815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108015780601f106107d657610100808354040283529160200191610801565b820191906000526020600020905b8154815290600101906020018083116107e457829003601f168201915b505050505081565b600081600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60035481565b8034141515610978576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f5265766572742062616c616e636520746f2073656e646572000000000000000081525060200191505060405180910390fd5b50565b6000600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610a34576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f5265766572742062616c616e636520746f2073656e646572000000000000000081525060200191505060405180910390fd5b600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610b4e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260408152602001807f5265766572742062616c616e636520746f2073656e646572206265636175736581526020017f20686520646f65736e74206861766520656e6f75676820616c6c6f77616e636581525060400191505060405180910390fd5b81600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600060046005836040518082805190602001908083835b602083101515610d1e5780518252602082019150602081019050602083039250610cf9565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff02191690836004811115610d6c57fe5b021790555060019050919050565b60028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e105780601f10610de557610100808354040283529160200191610e10565b820191906000526020600020905b815481529060010190602001808311610df357829003601f168201915b505050505081565b60066020528060005260406000206000915090505481565b600060036005836040518082805190602001908083835b602083101515610e6c5780518252602082019150602081019050602083039250610e47565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff02191690836004811115610eba57fe5b021790555060019050919050565b6000806004836040518082805190602001908083835b602083101515610f035780518252602082019150602081019050602083039250610ede565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000600281101515610f4457fe5b015442039050618ca0811015610fd6576004836040518082805190602001908083835b602083101515610f8c5780518252602082019150602081019050602083039250610f67565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206001600281101515610fcd57fe5b01549150610fdb565b600091505b50919050565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110775780601f1061104c57610100808354040283529160200191611077565b820191906000526020600020905b81548152906001019060200180831161105a57829003601f168201915b505050505081565b600081600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515611138576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f5265766572742062616c616e636520746f2053656e646572000000000000000081525060200191505060405180910390fd5b81600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b600061124c826113f7565b9050426004836040518082805190602001908083835b6020831015156112875780518252602082019150602081019050602083039250611262565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006002811015156112c857fe5b0181905550806004836040518082805190602001908083835b60208310151561130657805182526020820191506020810190506020830392506112e1565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600160028110151561134757fe5b01819055505050565b6007602052816000526040600020602052806000526040600020600091509150505481565b60006005826040518082805190602001908083835b6020831015156113af578051825260208201915060208101905060208303925061138a565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff169050919050565b600080600080600060014303935083406001900492507da7c5ac471b4784230fcf80dc33721d53cddd6e04c059210385c67dfe32a0915060018284886040516020018083815260200182805190602001908083835b602083101515611471578051825260208201915060208101905060208303925061144c565b6001836020036101000a038019825116818451168082178552505050505050905001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156114db57805182526020820191506020810190506020830392506114b6565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390206001900481151561151557fe5b0401905061271081101561152a57600a810290505b809450505050509190505600a165627a7a723058209e6b0a77346514d49d6e5c7acf7a25e885f5b3b90448a84c6d967d44f1cfbb570029";

    public static final String FUNC_NAME = "name";

    public static final String FUNC_TOTALSUPPLY = "totalSupply";

    public static final String FUNC_STANDARD = "standard";

    public static final String FUNC_BALANCEOF = "balanceOf";

    public static final String FUNC_SYMBOL = "symbol";

    public static final String FUNC_ALLOWANCE = "allowance";

    public static final String FUNC_TRANSFER = "transfer";

    public static final String FUNC_APPROVE = "approve";

    public static final String FUNC_TRANSFERFROM = "transferFrom";

    public static final String FUNC_STOREREQUEST = "storeRequest";

    public static final String FUNC_GENERATECHALLENGE = "generateChallenge";

    public static final String FUNC_GETCHALLENGE = "getChallenge";

    public static final String FUNC_GETREGISTRATIONSTATUS = "getRegistrationStatus";

    public static final String FUNC_MARKASVALID = "markAsValid";

    public static final String FUNC_MARKASINVALID = "markAsInvalid";

    public static final Event TRANSFER_EVENT = new Event("Transfer", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Address>() {}),
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
    ;

    public static final Event APPROVAL_EVENT = new Event("Approval", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Address>() {}),
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
    ;

    protected static final HashMap<String, String> _addresses;

    static {
        _addresses = new HashMap<String, String>();
        _addresses.put("5777", "0x9c09f1da24a23558d14229521542f0adfc44203f");
    }

    protected KuwaToken(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected KuwaToken(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public RemoteCall<String> name() {
        final Function function = new Function(FUNC_NAME, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<BigInteger> totalSupply() {
        final Function function = new Function(FUNC_TOTALSUPPLY, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<String> standard() {
        final Function function = new Function(FUNC_STANDARD, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<BigInteger> balanceOf(String param0) {
        final Function function = new Function(FUNC_BALANCEOF, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<String> symbol() {
        final Function function = new Function(FUNC_SYMBOL, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<BigInteger> allowance(String param0, String param1) {
        final Function function = new Function(FUNC_ALLOWANCE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(param0), 
                new org.web3j.abi.datatypes.Address(param1)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public static RemoteCall<KuwaToken> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, BigInteger _initialSupply) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_initialSupply)));
        return deployRemoteCall(KuwaToken.class, web3j, credentials, gasPrice, gasLimit, BINARY, encodedConstructor);
    }

    public static RemoteCall<KuwaToken> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, BigInteger _initialSupply) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_initialSupply)));
        return deployRemoteCall(KuwaToken.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, encodedConstructor);
    }

    public List<TransferEventResponse> getTransferEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(TRANSFER_EVENT, transactionReceipt);
        ArrayList<TransferEventResponse> responses = new ArrayList<TransferEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            TransferEventResponse typedResponse = new TransferEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._from = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse._to = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<TransferEventResponse> transferEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, TransferEventResponse>() {
            @Override
            public TransferEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(TRANSFER_EVENT, log);
                TransferEventResponse typedResponse = new TransferEventResponse();
                typedResponse.log = log;
                typedResponse._from = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse._to = (String) eventValues.getIndexedValues().get(1).getValue();
                typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<TransferEventResponse> transferEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(TRANSFER_EVENT));
        return transferEventObservable(filter);
    }

    public List<ApprovalEventResponse> getApprovalEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(APPROVAL_EVENT, transactionReceipt);
        ArrayList<ApprovalEventResponse> responses = new ArrayList<ApprovalEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ApprovalEventResponse typedResponse = new ApprovalEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._owner = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse._spender = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<ApprovalEventResponse> approvalEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, ApprovalEventResponse>() {
            @Override
            public ApprovalEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(APPROVAL_EVENT, log);
                ApprovalEventResponse typedResponse = new ApprovalEventResponse();
                typedResponse.log = log;
                typedResponse._owner = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse._spender = (String) eventValues.getIndexedValues().get(1).getValue();
                typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<ApprovalEventResponse> approvalEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(APPROVAL_EVENT));
        return approvalEventObservable(filter);
    }

    public RemoteCall<TransactionReceipt> transfer(String _to, BigInteger _value) {
        final Function function = new Function(
                FUNC_TRANSFER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_to), 
                new org.web3j.abi.datatypes.generated.Uint256(_value)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> approve(String _spender, BigInteger _value) {
        final Function function = new Function(
                FUNC_APPROVE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_spender), 
                new org.web3j.abi.datatypes.generated.Uint256(_value)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> transferFrom(String _from, String _to, BigInteger _value) {
        final Function function = new Function(
                FUNC_TRANSFERFROM, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_from), 
                new org.web3j.abi.datatypes.Address(_to), 
                new org.web3j.abi.datatypes.generated.Uint256(_value)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> storeRequest(BigInteger _gas, BigInteger weiValue) {
        final Function function = new Function(
                FUNC_STOREREQUEST, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_gas)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function, weiValue);
    }

    public RemoteCall<TransactionReceipt> generateChallenge(String _publicKey) {
        final Function function = new Function(
                FUNC_GENERATECHALLENGE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_publicKey)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<BigInteger> getChallenge(String _publicKey) {
        final Function function = new Function(FUNC_GETCHALLENGE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_publicKey)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<BigInteger> getRegistrationStatus(String _publicKey) {
        final Function function = new Function(FUNC_GETREGISTRATIONSTATUS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_publicKey)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint8>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<TransactionReceipt> markAsValid(String _publicKey) {
        final Function function = new Function(
                FUNC_MARKASVALID, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_publicKey)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> markAsInvalid(String _publicKey) {
        final Function function = new Function(
                FUNC_MARKASINVALID, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_publicKey)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public static KuwaToken load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new KuwaToken(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    public static KuwaToken load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new KuwaToken(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected String getStaticDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static String getPreviouslyDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static class TransferEventResponse {
        public Log log;

        public String _from;

        public String _to;

        public BigInteger _value;
    }

    public static class ApprovalEventResponse {
        public Log log;

        public String _owner;

        public String _spender;

        public BigInteger _value;
    }
}
