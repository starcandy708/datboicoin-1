pragma solidity 0.4.24;

contract SimpleStorage {
    struct imageHash{
        string ipfsHash;  
        address sender;
        uint timeStamp;
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
        hashMap[hashId].sender = msg.sender;
        hashMap[hashId].timeStamp = block.timestamp;
    }

    function get(uint _hashId ) constant public returns (string ipfsHash,address sender,uint time ) {
        return (hashMap[_hashId].ipfsHash, hashMap[_hashId].sender, hashMap[_hashId].timeStamp);

    }
    function getLastHash() constant public returns (uint HashId){
        return(lastHashId);
    }
}
