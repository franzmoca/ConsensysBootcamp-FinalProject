pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

contract PetitionManager is Ownable, Pausable {

    /*
        Create a variable to keep track of the event ID numbers.
    */
    uint public idGenerator;

    /*
        Struct containing details about a petitions and its signers.
    */
    struct Petition {
        string name;
        string description;
        string link;
        string ipfs_banner;
        address creator;
        uint totalSigns;
        uint targetSigns;
        mapping(address => bool) signers;
        bool isOpen;
    }

    struct User {
        string name;
        string ens;
        string ipfs_avatar;
    }

    mapping (uint => Petition) public petitions;
    mapping (address => User) public users;

    event LogUserCreated(address indexed userAddress, string name);
    event LogPetitionCreated(address indexed creator, uint petitionId);
    event LogPetitionSigned(address indexed signer, uint petitionId);
    event LogPetitionClosed(uint petitionId);

    modifier notUser(){
        //Best way to check if a string is uninitialized
        require(bytes(users[msg.sender].name).length == 0, "You are already registered");
        _;
    }

    modifier isUser(){
        //Best way to check if a string is uninitialized
        require(bytes(users[msg.sender].name).length > 0, "You need to register first.");
        _;
    }

    function createUser(string memory _name, string memory _ens, string memory _ipfs_avatar)
    public notUser returns(bool) {
        require(bytes(_name).length > 0, "Name cannot be null");
        users[msg.sender] = User({name: _name, ens: _ens, ipfs_avatar:_ipfs_avatar});
        emit LogUserCreated(msg.sender,_name);
        return true;
    }

    //TODO: readPetition e readUser
    function createPetition(string memory _name, string memory _description, string memory _link,
     string memory _ipfs_banner, uint  _targetSigns )
    public isUser returns(uint)
    {
        uint petitionId = idGenerator;
        Petition storage p = petitions[petitionId];
        p.name = _name;
        p.description = _description;
        p.link = _link;
        p.ipfs_banner = _ipfs_banner;
        p.creator = msg.sender;
        p.targetSigns = _targetSigns;
        p.isOpen = true;
        idGenerator++;
        emit LogPetitionCreated(msg.sender,petitionId);
        return petitionId;
    }

}