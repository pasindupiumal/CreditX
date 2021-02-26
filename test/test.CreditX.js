const CreditX = artifacts.require("../contracts/CreditX.sol");

contract("CreditX", accounts => {

    /**
     * @desc Checking whether the SUPER_ADMIN has been counted
     */
    it("adminCount should be equal to 1", async () => {

        const creditXInstance = await CreditX.deployed();
        const adminCount = await creditXInstance.adminCount();

        assert.equal(adminCount, 1, "SUPER_ADMIN is not counted");

    });

    /**
     * @desc Checking whether the contract deploying account is the SUPER_ADMIN
     */
    it("deployed account address should be equal to SUPER_ADMIN address", async () => {

        const creditXInstance = await CreditX.deployed();
        const admin = await creditXInstance.adminsByAddress(accounts[0]);

        assert.equal(admin._address, accounts[0], "SUPER_ADMIN is not set properly");

    });

    /**
     * @desc Checking whether the SUPER_ADMIN is consistent throughout the contract
     */
    it("SUPER_ADMIN should be same within both mappings", async () => {

        const creditXInstance = await CreditX.deployed();
        const admin1 = await creditXInstance.adminsByAddress(accounts[0]);
        const admin2 = await creditXInstance.adminsByIndex(0);

        assert.equal(admin1._address, admin2._address, "SUPER_ADMIN is not mapped consistently");

    });

});
