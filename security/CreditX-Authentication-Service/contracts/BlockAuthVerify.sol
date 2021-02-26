pragma solidity ^0.5.16;

//Implementation of the smart contract for maintaining relevant and required data of users.
contract BlockAuthVerify {

    //Variables and maps declarations
    address payable owner;
    mapping ( address => string ) usernames;
    mapping ( string => address ) reverse_usernames;
    mapping ( string => string ) block_auth_urls;
    mapping ( string => string ) public_keys;

    //Declaration of events. Used to identify the success of specific operations
    event NewUserAdded(address from, string username, bool success);
    event NewVerification(address from, string username, string verificationType, bool success);
    event UserDataUpdated(address from, string username, bool success);

    //Default constructor. Obtains the Ethereum address of the account invoking the smart contract and assigning to owner.
    constructor() public {

        owner = msg.sender;
    }

    //Destructor of the smart contract.
    function killBlockAuth() public {

        if(msg.sender == owner){
            selfdestruct(owner);
        }
    }

    /*
        Method for inserting a new user to the chain. Obtains relevant information as parameters.
        Registers the new user with the platform if not already registered.
        Emits the NewUserAdded event to signal the status of the addNewUser operation.
    */
    function addNewUser(string memory username, string memory block_auth_url, string memory public_key) public returns (bool) {

        if (reverse_usernames[username] == 0x0000000000000000000000000000000000000000){

            usernames[msg.sender] = username;
            reverse_usernames[username] = msg.sender;
            block_auth_urls[username] = block_auth_url;
            public_keys[username] = public_key;

            emit NewUserAdded(msg.sender, username, true);
            return true;
        }

        emit NewUserAdded(msg.sender, username, false);
        return false;
    }

    /*
        Method for determining whether a specific username is already registered in the blockchain.this
        Takes the username in question as a parameter and returns boolean.
    */
    function usernameAvailable(string memory username) public view returns (bool) {

        if (reverse_usernames[username] == 0x0000000000000000000000000000000000000000) {

            return true;
        }
        else{
            return false;
        }
    }

    /*
        Method to obtain the username associated with a specific blockchain address.
        Takes the blockchain address as an input parameter and returns the username if located.
    */
    function getUsername(address user_address) public view returns (string memory) {
        return usernames[user_address];
    }

    /*
        Method to obtain the blockchain address associated with a specific username.
        Takes the username as an input parameter and returns the ethereum address associated.
    */
    function getAddress(string memory username) public view returns (address) {
        return reverse_usernames[username];
    }

    /*
        Method to obtain the unique url generated for each user.
        Takes the username as an input parameter and returns the url associated with that username.
    */
    function getBlockAuthUrl(string memory username) public view returns (string memory) {
        return block_auth_urls[username];
    }

    /*
        Method to obtain the public key associated with a specific username.
        This public key refers to the public key of the RSA key pair generated for each new user.
        Takes the username as an input parameter and returns the public key assocaited.
    */
    function getBlockAuthPublicKey(string memory username) public view returns (string memory) {
        return public_keys[username];
    }

}