pragma solidity 0.4.24;

contract SimpleStorage {
    struct imageHash{
       string ipfsHash;  
    } 
    //Hash Map
    mapping(uint => imageHash) public hashMap;
    
    uint public lastHashId;

    function SimpleStorage() public {
        lastHashId = 0;
    }

    function set(string _ipfsHash) public {
        uint hashId = ++lastHashId;
        hashMap[hashId].ipfsHash = _ipfsHash;
    }

    function get(uint _hashId ) constant public returns (string ipfsHash) {
        return (hashMap[_hashId].ipfsHash);

    }
    function getLastHash() constant public returns (uint HashId){
        return(lastHashId);
    }
}
