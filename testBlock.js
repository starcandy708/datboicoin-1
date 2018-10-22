module.exports = function(callback){
    SimpleStorage.deployed().then(function(i) {app = i;})
    truffle(development)> app.get().then(function(value) {ipfsHash = value});
    truffle(development)> ipfsHash
}

