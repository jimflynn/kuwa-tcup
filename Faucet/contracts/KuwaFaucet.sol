// contracts/HelloWorld.sol

pragma solidity ^0.4.0;

contract KuwaFaucet {
  string public key1 = 'xpub6Cg17gepLkXu8uM1Q8Y5ZRCg2yNcbDHcHrBF955LGtL7Tg9cec9xpCzMzEVs9uRSUvwCshoppm4h4Ze67YC9nVKzupeye5qbJurXq2JEy2x';
  string public key2 = 'xpub6BiWuCaFQEkfHWniH5385b3Ffc7asL6QzWFF5GmbTZMNHRB6StK699QbtGVcAftUBkdwK4Fwo7bQh1wXyR7oBhCfR9NNTh5EaRXLbQEG7nQ';
  string public key3 = 'xpub6Cs8CzmVHxWCxQdGZY5VFCjnp5fZNf4TLErmaprJdps8y3wePuV7sNnPq7PUj8vwXaedUbPDcMdpgjt6DoiLopVvUAhacNAu6kHrvUqYNkH';

  function getValidKuwaID() public view returns(string,string,string) {
    return (key1,key2,key3);
  }
  
  
}