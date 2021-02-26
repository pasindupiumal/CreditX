pragma solidity >=0.5.0;
import "./CreditX.sol";
import "./XUni.sol";

contract External {

    CreditX public X;
    XUni public Y;

    constructor(address _address) public {
        X = CreditX(_address);
        X.initializeExternal(address(this));
    }

    function initializeXUni(address _address) public {
        Y = XUni(_address);
    }

    uint256 public employerCount = 0;

    mapping(uint256 => Employer) public employersByIndex;

    mapping(address => Employer) public employersByAddress;

    mapping(address => uint256) public studentCreditViewRequestsCount;

    mapping(address => mapping(uint256 => CreditViewRequest)) public studentCreditViewRequests;

    mapping(address => uint256) public employerCreditViewRequestsCount;

    mapping(address => mapping(uint256 => CreditViewRequest)) public employerCreditViewRequests;

    struct Employer {
        uint _index;
        address _address;
        string _company;
        string _email;
        bool _active;
    }

    struct CreditViewRequest {
        uint _index;
        address _studentAddress;
        address _employerAddress;
        bool _permission;
        bool _active;
    }

    function isPermissionGranted(address _employerAddress, uint256 _stRqIndex) view public returns (bool) {
        return employerCreditViewRequests[_employerAddress][_stRqIndex]._permission;
    }

    function isEmployerActive(address _address) view public returns (bool) {
        return employersByAddress[_address]._active;
    }

    modifier onlyAdmin {
        require(X.isAdminActive(msg.sender), "Only Admin can call this");
        _;
    }

    modifier checkAddressAvailability(address _address) {
        require(!X.isAdminActive(_address), "Provided address is already in use");
        require(!X.isStudentActive(_address), "Provided address is already in use");
        require(!Y.isUniversityActive(_address), "Provided address is already in use");
        require(!employersByAddress[_address]._active, "Provided address is already in use");
        _;
    }

    //(employersByAddress[msg.sender]._active && studentCreditViewRequests[_address][msg.sender]._permission)

    function addEmployer(address _address, string memory _company, string memory _email) public onlyAdmin checkAddressAvailability(_address) {
        Employer memory employer = Employer(employerCount, _address, _company, _email, true);
        employersByAddress[_address] = employer;
        employersByIndex[employerCount] = employer;

        employerCount++;
    }

    function addCreditViewRequest(address _studentAddress) public {
        require(employersByAddress[msg.sender]._active, "Invalid Employer");
        require(X.isStudentActive(_studentAddress), "Student does not exist");
        require(studentCreditViewRequestsCount[_studentAddress] == employerCreditViewRequestsCount[msg.sender], "Invalid Request");

        CreditViewRequest memory creditViewRequest = CreditViewRequest(studentCreditViewRequestsCount[_studentAddress], _studentAddress, msg.sender, false, true);

        studentCreditViewRequests[_studentAddress][studentCreditViewRequestsCount[_studentAddress]] = creditViewRequest;
        employerCreditViewRequests[msg.sender][employerCreditViewRequestsCount[msg.sender]] = creditViewRequest;

        studentCreditViewRequestsCount[_studentAddress]++;
        employerCreditViewRequestsCount[msg.sender]++;
    }

    function respondCreditViewRequest(uint256 _index, address _employerAddress, bool response) public {
        require(X.isStudentActive(msg.sender), "Student does not exist");
        require(studentCreditViewRequests[msg.sender][_index]._active, "Request does not exist");

        studentCreditViewRequests[msg.sender][_index]._permission = response;
        employerCreditViewRequests[_employerAddress][_index]._permission = response;
    }

}
