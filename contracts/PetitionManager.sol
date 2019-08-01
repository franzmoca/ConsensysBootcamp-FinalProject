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
        mapping(uint => address) signersId;
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
    event LogPetitionSigned(address indexed signer, uint petitionId, uint totalSigns);
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

    modifier isCreator(uint _petitionId){
        require(petitions[_petitionId].creator == msg.sender, "Only the creator of the petition can do this");
        _;
    }

    modifier petitionExists(uint _petitionId){
        require(petitions[_petitionId].creator != address(0), "Requested petition does not exist!");
        _;
    }

    function createUser(string memory _name, string memory _ens, string memory _ipfs_avatar)
    public notUser returns(bool) {
        require(bytes(_name).length > 0, "Name cannot be null");
        users[msg.sender] = User({name: _name, ens: _ens, ipfs_avatar:_ipfs_avatar});
        emit LogUserCreated(msg.sender,_name);
        return true;
    }

    function readPetition(uint petitionId)
    public view petitionExists(petitionId) returns(string memory name, string memory description, string memory link,
     string memory ipfs_banner, address creator, uint  targetSigns, uint totalSigns, bool isOpen) {
        Petition storage p = petitions[petitionId];
        name = p.name;
        description = p.description;
        link = p.link;
        ipfs_banner = p.ipfs_banner;
        creator = p.creator;
        targetSigns = p.targetSigns;
        totalSigns = p.totalSigns;
        isOpen = p.isOpen;
     }

    function readUser(address userAddress)
    public view returns(string memory name, string memory ens, string memory ipfs_avatar){
        User storage u = users[userAddress];
        name = u.name;
        ens = u.ens;
        ipfs_avatar = u.ipfs_avatar;
    }

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

    function signPetition(uint petitionId)
    public isUser petitionExists(petitionId) returns(bool)
    {
        Petition storage p = petitions[petitionId];
        require(!p.signers[msg.sender], "You already signed the petition!");
        require(p.isOpen, "The petition was closed.");
        p.signersId[p.totalSigns] = msg.sender;
        p.signers[msg.sender] = true;
        p.totalSigns++;
        //Do something if targetSigns are reached?!
        emit LogPetitionSigned(msg.sender,petitionId,p.totalSigns);
        return true;
    }

    function closePetition(uint petitionId)
    public petitionExists(petitionId) isCreator(petitionId) returns(bool)
    {
        petitions[petitionId].isOpen = false;
        return true;
    }

    function getSignaturesFromRange(uint start, uint end, uint petitionId)
    public view petitionExists(petitionId) isUser returns(address[] memory){
        require(start < end, "Start of range must be smaller than end");
        require(end<=petitions[petitionId].totalSigns,"End of range is too big");
        address[] memory signArray;
        Petition storage p = petitions[petitionId];
        uint j = 0;
        for(uint i = start; i<=end;i++){
            address signer = p.signersId[i];
            if(p.signers[signer]){
                signArray[j] = signer;
                j++;
            }
        }
        return signArray;
    }

    function getSignaturesFromIndex(uint index, uint petitionId)
    public view petitionExists(petitionId) isUser returns(string memory name, string memory ens, string memory ipfs_avatar, address  userAddress){
        require(index<=petitions[petitionId].totalSigns,"Requested index is outofbound ");
        User memory sign;
        Petition storage p = petitions[petitionId];
        address signer = p.signersId[index];
        if(p.signers[signer]){
            sign = users[signer];
        }
        name = sign.name;
        ens = sign.ens;
        ipfs_avatar = sign.ipfs_avatar;
        userAddress = signer;
    }


}