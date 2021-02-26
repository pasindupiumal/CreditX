pragma solidity >=0.5.0;

import "./External.sol";
import "./XUni.sol";

/**
 * @title CreditX
 * @dev Implements the credit storing system business logic.
 */
contract CreditX {

    External public X;
    XUni public Y;

    function initializeExternal(address _address) public {
        X = External(_address);
    }

    function initializeXUni(address _address) public {
        Y = XUni(_address);
    }

    bool public connect = true;

    enum Grade {AP, A, AM, BP, B, BM, CP, C, CM, DP, D, E}

    // student count
    uint256 public studentCount = 0;
    // Students store by address (Student _address => Student)
    mapping(address => Student) public studentsByAddress;
    // Students store by id (Student _id => Student)
    mapping(string => Student) public studentsById;
    // Students store by index (Student _index => Student)
    mapping(uint => Student) public studentsByIndex;

    // Admin count
    uint256 public adminCount = 0;
    // Admins store by address (Admin _address => Admin)
    mapping(address => Administrator) public adminsByAddress;
    // Admins store by index (Admin _index => Admin)
    mapping(uint => Administrator) public adminsByIndex;

    // Module count
    uint256 public moduleCount = 0;
    // Modules store (Module _code => Module)
    mapping(string => Module) public modulesByCode;
    // Modules store (Module _index => Module)
    mapping(uint => Module) public modulesByIndex;

    // Student credits store (Student _address => (Module _code => #credits))
    mapping(address => mapping(string => Module)) private studentCredits;
    // Student credited modules count (Student _address => #modules)
    mapping(address => uint256) public studentsCreditsCount;
    // Total credits of the student (Student _address => #credits)
    mapping(address => uint256) private totalStudentsCredits;

    // Student enrolled modules (Student _address => Module _code)
    mapping(address => Module[]) public studentEnrolledModules;
    // Student enrolled modules count (Student _address => #modules)
    mapping(address => uint256) public studentEnrolledModulesCount;

    struct Administrator {
        uint _index;
        address _address;
        string _name;
        bool _active;
    }

    struct Student {
        uint _index;
        string _id;
        address _address;
        string _name;
        bool _active;
        bool _transfer;
    }

    struct Module {
        uint _index;
        string _code;
        string _name;
        uint8 _credits;
        bool _active;
        bool _graded;
        uint256 _obtainedCredits;
    }

    /**
     * @dev constructor of the CreditX system.
     */
    constructor() public {
        Administrator memory admin = Administrator(adminCount, msg.sender, "SUPER_ADMIN", true);
        adminsByAddress[msg.sender] = admin;
        adminsByIndex[adminCount] = admin;
        adminCount++;
    }

    /**
     * @dev Modifier for limiting access only to admin.
     */
    modifier onlyAdmin {
        require(adminsByAddress[msg.sender]._active, "Only Admin can call this");
        _;
    }

    function isAdminActive(address _address) view public returns (bool) {
        return adminsByAddress[_address]._active;
    }

    function isStudentActive(address _address) view public returns (bool) {
        return studentsByAddress[_address]._active;
    }

    modifier checkAddressAvailability(address _address) {
        require(!adminsByAddress[_address]._active, "Provided address is already in use");
        require(!studentsByAddress[_address]._active, "Provided address is already in use");
        require(!X.isEmployerActive(_address), "Provided address is already in use");
        require(!Y.isUniversityActive(_address), "Provided address is already in use");
        _;
    }

    /**
    * @dev Returns the Grade according to the marks
    * @param _marks Marks
    */
    function getGrade(uint256 _marks) pure internal returns (Grade) {

        if (_marks > 100) {
            if (_marks % 10 >= 5) {
                _marks = _marks / 10;
                _marks++;
            } else {
                _marks = _marks / 10;
            }
        }

        if (_marks <= 100 && _marks >= 90) {
            return Grade.AP;
        } else if (_marks < 90 && _marks >= 80) {
            return Grade.A;
        } else if (_marks < 80 && _marks >= 75) {
            return Grade.AM;
        } else if (_marks < 75 && _marks >= 70) {
            return Grade.BP;
        } else if (_marks < 70 && _marks >= 65) {
            return Grade.B;
        } else if (_marks < 65 && _marks >= 60) {
            return Grade.BM;
        } else if (_marks < 60 && _marks >= 55) {
            return Grade.CP;
        } else if (_marks < 55 && _marks >= 45) {
            return Grade.C;
        } else if (_marks < 45 && _marks >= 40) {
            return Grade.CM;
        } else if (_marks < 40 && _marks >= 35) {
            return Grade.DP;
        } else if (_marks < 35 && _marks >= 30) {
            return Grade.D;
        } else {
            return Grade.E;
        }
    }

    /**
     * @dev Returns the Credits according to the grade
     * @param _grade Grade
     * @param _code module code
     */
    function getCredits(Grade _grade, string memory _code) view internal returns (uint256) {

        Module memory module = modulesByCode[_code];

        require(module._active, "Module dose not exist");

        if (_grade == Grade.AP) {
            return (4000 / 4) * module._credits;
        } else if (_grade == Grade.A) {
            return (4000 / 4) * module._credits;
        } else if (_grade == Grade.AM) {
            return (3700 / 4) * module._credits;
        } else if (_grade == Grade.BP) {
            return (3300 / 4) * module._credits;
        } else if (_grade == Grade.B) {
            return (3000 / 4) * module._credits;
        } else if (_grade == Grade.BM) {
            return (2700 / 4) * module._credits;
        } else if (_grade == Grade.CP) {
            return (2300 / 4) * module._credits;
        } else if (_grade == Grade.C) {
            return (2000 / 4) * module._credits;
        } else if (_grade == Grade.CM) {
            return (1700 / 4) * module._credits;
        } else if (_grade == Grade.DP) {
            return (1300 / 4) * module._credits;
        } else if (_grade == Grade.D) {
            return (1000 / 4) * module._credits;
        } else {
            return 0;
        }

    }

    /**
     * @dev Check number of digits in a number.
     * @param _number Number input
     */
    function numberOfDigits(uint _number) pure internal returns (uint) {
        uint digits = 0;

        while (_number != 0) {
            _number /= 10;
            digits++;
        }

        return digits;
    }

    /**
     * @dev Check the Module array.
     * @param _modules Module[]
     * @param _code module code
     */
    function containsModule(Module[] memory _modules, string memory _code) pure internal returns (bool) {
        for (uint256 i = 0; i < _modules.length; i++) {
            if (compareString(_modules[i]._code, _code)) return true;
        }
        return false;
    }

    /**
     * @dev Compare two strings.
     * @param _str1 first string
     * @param _str2 second string
     */
    function compareString(string memory _str1, string memory _str2) pure internal returns (bool) {
        return keccak256(bytes(_str1)) == keccak256(bytes(_str2));
    }


    function getStudentsCredits(address _address, string memory _code, uint256 _stRqIndex) view public returns (uint, string memory, string memory, uint8, bool, bool, uint256) {
        require(adminsByAddress[msg.sender]._active || (studentsByAddress[msg.sender]._active && _address == msg.sender) || (X.isEmployerActive(msg.sender) && X.isPermissionGranted(msg.sender, _stRqIndex)), "Not Authorized");
        Module memory m = studentCredits[_address][_code];
        return (m._index, m._code, m._name, m._credits, m._active, m._graded, m._obtainedCredits);
    }

    function getTotalStudentsCredits(address _address, uint256 _stRqIndex) view public returns (uint256) {
        require(adminsByAddress[msg.sender]._active || (studentsByAddress[msg.sender]._active && _address == msg.sender) || (X.isEmployerActive(msg.sender) && X.isPermissionGranted(msg.sender, _stRqIndex)), "Not Authorized");
        return totalStudentsCredits[_address];
    }

    /**
     * @dev Add an Admin to the store
     * @param _address ETH address of the admin
     * @param _name name of the admin
     */
    function addAdmin(address _address, string memory _name) public onlyAdmin checkAddressAvailability(_address) {

        Administrator memory admin = Administrator(adminCount, _address, _name, true);
        adminsByAddress[_address] = admin;
        adminsByIndex[adminCount] = admin;

        adminCount++;
    }

    /**
     * @dev Add a student to the store.
     * @param _id student id
     * @param _name student name
     * @param _address ETH address of the student
     */
    function addStudent(string memory _id, string memory _name, address _address, bool _active, bool _transfer, uint256 _creditCount) public onlyAdmin checkAddressAvailability(_address) {
        require(!studentsById[_id]._active, "Provided ID is already in use");

        Student memory student = Student(studentCount, _id, _address, _name, _active, _transfer);
        studentsByAddress[_address] = student;
        studentsById[_id] = student;
        studentsByIndex[studentCount] = student;

        studentsCreditsCount[_address] = 0;
        totalStudentsCredits[_address] = _creditCount * 1000;

        studentCount++;
    }

    /**
     * @dev Add a module to the store without a lecturer.
     * @param _code module code
     * @param _name module name
     * @param _credits no. of credits allocated to the module
     */
    function addModule(string memory _code, string memory _name, uint8 _credits) public onlyAdmin {
        require(!modulesByCode[_code]._active, "Module code is already in use");

        modulesByCode[_code] = Module(moduleCount, _code, _name, _credits, true, false, 0);
        modulesByIndex[moduleCount] = Module(moduleCount, _code, _name, _credits, true, false, 0);
        moduleCount++;
    }

    /**
     * @dev Set credits to a module of a student.
     * @param _address Student id
     * @param _code module code
     * @param _marks marks student has obtained for the module
     */
    function setCredits(address _address, string memory _code, uint256 _marks) public onlyAdmin {
        require(modulesByCode[_code]._active, "Module does not exist");
        require(containsModule(studentEnrolledModules[_address], _code), "Student is not enrolled to this module");
        require(numberOfDigits(_marks) <= 3, "Invalid marks input");

        uint256 credits = getCredits(getGrade(_marks), _code);

        if (studentCredits[_address][_code]._graded) {
            totalStudentsCredits[_address] -= studentCredits[_address][_code]._obtainedCredits;
        }

        studentCredits[_address][_code]._obtainedCredits = credits;
        studentCredits[_address][_code]._graded = true;
        totalStudentsCredits[_address] += credits;
    }

    /**
    * @dev Enroll a student to a module.
    * @param _address Student address
    * @param _code module code
    */
    function enrollStudent(address _address, string memory _code) public onlyAdmin {
        require(modulesByCode[_code]._active, "Module does not exist");
        require(studentsByAddress[_address]._active, "Student does not exist");
        require(!containsModule(studentEnrolledModules[_address], _code), "Student is already enrolled to this module");

        studentEnrolledModules[_address].push(modulesByCode[_code]);
        studentEnrolledModulesCount[_address] = studentEnrolledModules[_address].length;

        studentCredits[_address][_code] = modulesByCode[_code];
        studentsCreditsCount[_address]++;

    }

}
