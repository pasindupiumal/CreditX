pragma solidity >=0.5.0;
import "./External.sol";
import "./CreditX.sol";

contract XUni {

    External public X;
    CreditX public Y;

    constructor(address _ExternalAddress, address _CreditXAddress) public {
        X = External(_ExternalAddress);
        Y = CreditX(_CreditXAddress);
        X.initializeXUni(address(this));
        Y.initializeXUni(address(this));
    }

    uint256 public universityCount = 0;

    mapping(uint256 => University) public universityByIndex;

    mapping(address => University) public universityByAddress;

    uint256 public transferRequestsCount = 0;

    mapping(uint256 => TransferRequest) public transferRequests;

    mapping(address => uint256) public universityTransferRequestsCount;

    mapping(address => mapping(uint256 => TransferRequest)) public universityTransferRequests;

    struct University {
        uint256 _index;
        address _address;
        string _name;
        string _email;
        bool _active;
    }

    struct TransferRequest{
        uint256 _index;
        uint256 _uniIndex;
        string _studentName;
        address _universityAddress;
        bool _approval;
        bool _active;
        uint256 _creditCount;
        string _studentId;
    }

    function isUniversityActive(address _address) view public returns (bool) {
        return universityByAddress[_address]._active;
    }

    function isApproved(uint256 _trRqIndex) view public returns (bool) {
        return transferRequests[_trRqIndex]._approval;
    }

    modifier onlyAdmin {
        require(Y.isAdminActive(msg.sender), "Only Admin can call this");
        _;
    }

    modifier checkAddressAvailability(address _address) {
        require(!Y.isAdminActive(_address), "Provided address is already in use");
        require(!Y.isStudentActive(_address), "Provided address is already in use");
        require(!X.isEmployerActive(_address), "Provided address is already in use");
        require(!universityByAddress[_address]._active, "Provided address is already in use");
        _;
    }

    function addUniversity(address _address, string memory _name, string memory _email) public onlyAdmin checkAddressAvailability(_address) {
        University memory university = University(universityCount, _address, _name, _email, true);
        universityByAddress[_address] = university;
        universityByIndex[universityCount] = university;

        universityCount++;
    }

    function addTransferRequest(string memory _name, address _universityAddress, uint256 _creditCount, string memory _studentId) public onlyAdmin {
        require(universityByAddress[_universityAddress]._active, "Invalid University");

        TransferRequest memory req = TransferRequest(transferRequestsCount, universityTransferRequestsCount[_universityAddress], _name, _universityAddress, false, true, _creditCount, _studentId);

        transferRequests[transferRequestsCount] = req;
        universityTransferRequests[_universityAddress][universityTransferRequestsCount[_universityAddress]] = req;

        transferRequestsCount++;
        universityTransferRequestsCount[_universityAddress]++;
    }

    function respondTransferRequest(uint256 _uniIndex, bool response) public {
        require(universityByAddress[msg.sender]._active, "University does not exist");
        require(universityTransferRequests[msg.sender][_uniIndex]._active, "Request does not exist");

        universityTransferRequests[msg.sender][_uniIndex]._approval = response;
        transferRequests[universityTransferRequests[msg.sender][_uniIndex]._index]._approval = response;
    }

}
