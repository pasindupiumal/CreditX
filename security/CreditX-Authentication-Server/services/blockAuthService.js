const config = require('../config');
const Web3 = require('web3');
const ethereumTx = require('ethereumjs-tx').Transaction;

//Acquiring required configurations
const abi = config.ABI;
const contractAddress = config.CONTRACT_ADDRESS;
const ethereumAccount = config.ETHEREUM_ACCOUNT_ADDRESS;
const privateKey = config.PRIVATE_KEY;
const ethNodeAddress = config.ETHEREUM_NODE_ADDRESS;
const baseURL = config.BASE_URL;

//Initializing the web3 provider
const web3 = new Web3(new Web3.providers.HttpProvider(ethNodeAddress));
//Setting up the default account
web3.eth.defaultAccount = ethereumAccount;
//Setting up the contract
const contract = new web3.eth.Contract(abi, contractAddress, {

    from: web3.eth.defaultAccount,
    gas: 3000000

});

//Implementation of the BlockAuthService
const BlockAuthService = function() {

    /*
        Method for adding a new user to the blockchain. The BlockAuthController invokes this method by passing the
        required parameters.
     */
    this.addNewUser = (userData) => {

        console.log(userData);

        return new Promise((resolve, reject) => {

            //Obtain the nonce value
            web3.eth.getTransactionCount(web3.eth.defaultAccount, function (error, nonce) {

                if (error){

                    reject({status: 500, message: 'Error obtaining nonce value - ' + error});

                }
                else{

                    console.log('Nonce value is ' + nonce);
        
                    const functionABI = contract.methods.addNewUser(userData.username, userData.block_auth_url, userData.public_key).encodeABI();
            
                    let details = {
            
                        "nonce": nonce,
                        "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
                        "gas": 3000000,
                        "to": contractAddress,
                        "value": 0,
                        "data": functionABI

                    };
            
                    const transaction = new ethereumTx(details);
            
                    transaction.sign(Buffer.from(privateKey, 'hex'));
            
                    let rawData = '0x' + transaction.serialize().toString('hex');

                    web3.eth.sendSignedTransaction(rawData).on('transactionHash', function(hash) {
            
                        console.log('Transaction Hash: ' + hash);
            
                    }).on('receipt', function(receipt) {
            
                        console.log('Transaction Receipt: ' + receipt);

                        //Once the transaction is completed sccessfully, verify whether the user is successfully added to the chain.
                        contract.methods.usernameAvailable(userData.username).call((error, result) => {
            
                            if (error){

                                //Perform proper error handling.
                                reject({status: 500, message: 'Error obtaining new user confirmation: ' + error});

                            }
                            else{

                                if (result == false){

                                    resolve({status: 200, message: 'User data added to blockchain', data: receipt});

                                }
                                else{

                                    //Perform proper error handling.
                                    reject({status: 500, message: 'Error inserting new user to blockchain'});

                                }

                            }

                        });
            
                    }).on('error', function(error){

                        //Perform proper error handling.
                        console.log('Transaction error: ' + error);
                        reject({status: 500, message: 'Error completing insert user transaction: ' + error});

                    });

                }        
        
            });
            
        });

    };

    /*
        Method to obtain the public key associated with a particular username from the chain. Take
        username as an input parameter and provides the public key associated.
     */
    this.getBlockAuthPublicKey = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.getBlockAuthPublicKey(username).call((error, result) => {

                if(error){

                    reject({status: 500, message: 'Error - ' + error});

                }
                else{

                    resolve({status: 200, message: 'Public key received', data: result});

                }

            });
            
        });

    };


    /*
        Method to verify whether a specific username is already registered in the blockchain.
        Takes the username as an input parameter and provides the status of the username availability.
     */
    this.usernameAvailable = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.usernameAvailable(username).call((error, result) => {

                if(error){

                    reject({status: 500, message: 'Error - ' + error});

                }
                else{

                    resolve({status: 200, message: 'Username availability status received', data: result});

                }

            });
            
        });

    };

    /*
        Method to obtain the unique url generated for each user from the blockchain.Takes the username
        of the user as an input parameter and provides the associated url.
     */
    this.getBlockAuthUrl = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.getBlockAuthUrl(username).call((error, result) => {

                if(error){

                    reject({status: 500, message: 'Error - ' + error});

                }
                else{

                    resolve({status: 200, message: 'User url received', data: result});

                }

            });
            
        });

    };

    /*
        Method to obatin the Ethereum address associated with a particular user. Takes the
        username as an input parameter and provides the Ethereum address of the users' default account.
     */
    this.getAddress = (username) => {

        return new Promise((resolve, reject) => {

            contract.methods.getAddress(username).call((error, result) => {

                if(error){

                    reject({status: 500, message: 'Error - ' + error});

                }
                else{

                    resolve({status: 200, message: 'User address received', data: result});

                }

            });
                        
        });

    };

    /*
        Method for generating the Ethereum account for new users. For each new user a new Ethereum is created
        by default unless specified otherwise.
     */
    this.createEthereumAccount = (username) => {

        return new Promise((resolve, reject) => {

            const newAccount = web3.eth.accounts.create(web3.utils.randomHex(32));

            if (!newAccount){

                reject({status: 500, message: 'Error encountered creating new Ethereum account - ' + error});

            }
            else{

                resolve({status: 200, message: 'User address received', data: newAccount});

            }
                        
        });

    };

};


module.exports = new BlockAuthService();