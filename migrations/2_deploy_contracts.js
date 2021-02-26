const CreditX = artifacts.require("./CreditX.sol");
const External = artifacts.require("./External.sol");
const XUni = artifacts.require("./XUni.sol");

module.exports = function (deployer) {
    deployer.deploy(CreditX)
        .then(() => deployer.deploy(External, CreditX.address).then(() => deployer.deploy(XUni, External.address, CreditX.address)))
};

/*module.exports = async deployer => {
    await deployer.deploy(CreditX);
    let CreditXInstance = await CreditX.deployed();
    await deployer.deploy(External, CreditXInstance.address);
    let ExternalInstance = await CreditX.deployed();
    await CreditXInstance.initialize(ExternalInstance.address);
};*/
