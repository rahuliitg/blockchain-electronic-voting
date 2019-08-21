var HelloBlockchain = artifacts.require("HelloBlockchain");
var Arg = "Hello world";
module.exports = deployer => {
    deployer.deploy(HelloBlockchain, Arg);
};
var Voting = artifacts.require("Voting");
// var Arg = "Hello world";
module.exports = deployer => {
    deployer.deploy(Voting);
};
