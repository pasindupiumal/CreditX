const BlockAuthVerify = artifacts.require("./BlockAuthVerify.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockAuthVerify);
};
