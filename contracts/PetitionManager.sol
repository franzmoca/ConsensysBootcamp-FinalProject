pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

/// @title PetitionManager
/// @notice Decentralized petition system
/// @author Francesco Moca 2019
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

    /// @notice each petition has one unique uint as key
    mapping (uint => Petition) public petitions;
    /// @notice unregistered users can be recognized by empty name
    mapping (address => User) public users;

    event LogUserCreated(address indexed userAddress, string name);
    event LogPetitionCreated(address indexed creator, uint petitionId);
    event LogPetitionSigned(address indexed signer, uint petitionId, uint totalSigns);
    event LogPetitionClosed(uint petitionId);

    /// @dev check if the user never registered
    modifier notUser(){
        //Best way to check if a string is uninitialized
        require(bytes(users[msg.sender].name).length == 0, "You are already registered");
        _;
    }

    /// @dev check if an user is registered by his name. The name is the only obligatory field of an user (for now)
    modifier isUser(){
        //Best way to check if a string is uninitialized
        require(bytes(users[msg.sender].name).length > 0, "You need to register first.");
        _;
    }

    /// @dev check if the sender created the petition he want to act on
    modifier isCreator(uint _petitionId){
        require(petitions[_petitionId].creator == msg.sender, "Only the creator of the petition can do this");
        _;
    }

    /// @dev every existing petition has an associated creator address
    modifier petitionExists(uint _petitionId){
        require(petitions[_petitionId].creator != address(0), "Requested petition does not exist!");
        _;
    }

    /// @notice Create an user giving a name and eventually an ens and an ipfs hash rapresenting an image
    /// @dev Cannot be run if already an user or if the contract is paused!
    /// @param _name must not be null
    /// @param _ens (crosschecking the validity of an ens in solidity is expensive, it's easier doing it client side)
    /// @param _ipfs_avatar if the ipfs hash given is empty or not valid, a placeholder is shown clientside
    /// @return boolean for success
    function createUser(string memory _name, string memory _ens, string memory _ipfs_avatar)
    public notUser whenNotPaused returns(bool) {
        require(bytes(_name).length > 0, "Name cannot be null");
        users[msg.sender] = User({name: _name, ens: _ens, ipfs_avatar:_ipfs_avatar});
        emit LogUserCreated(msg.sender,_name);
        return true;
    }

    /// @notice Create a Petition
    /// @dev Cannot be run if not an user or if the contract is paused!
    /// @param _name  Name is not unique cannot be used as key
    /// @param _description A longer description means a more expensive petition deploy, in future it should be limited.
    /// @param _link Useful resource for additional informations
    /// @param _ipfs_banner if the ipfs hash given is empty or not valid, a placeholder is shown clientside
    /// @param _targetSigns for now this value is just cosmetic, it could be used to close a petition automatically, or for other triggers
    /// @return petition unique id (uint)
    function createPetition(string memory _name, string memory _description, string memory _link,
     string memory _ipfs_banner, uint  _targetSigns )
    public isUser whenNotPaused returns(uint)
    {
        require(bytes(_name).length > 0, "Name cannot be null");
        require(_targetSigns > 0, "The target signatures must be positive");

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

    /// @notice Sign a petition, registering your data ad increasing the sign count
    /// @dev Cannot be run if not an user, if the contract is paused, if you already signed, if the petition doesn't exist or is closed!
    /// @param petitionId ...
    /// @return boolean for success
    function signPetition(uint petitionId)
    public isUser whenNotPaused petitionExists(petitionId) returns(bool)
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

    /// @notice Close the petition not allowing more users to sign it
    /// @dev The petition should ofcourse exist and only the creator can call this method.
    /// @param petitionId ...
    /// @return boolean for success
    function closePetition(uint petitionId)
    public petitionExists(petitionId) isCreator(petitionId) returns(bool)
    {
        petitions[petitionId].isOpen = false;
        return true;
    }

    /// @notice Obtain the information about a single signature.
    /// @dev The conditional if is present to allow in the future an user to withdrawn his signature. (Not implemented right now)
    /// @param index The index parameters should be smaller than the total signatures of the petition!
    /// @param petitionId the petition existance is checked with the corresponding modifier
    /// @return name, ens, ipfs_avatar (User struct decomposed for solidity limitations) and signing address
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

    /// @notice fallback function, not payable (there is now value exchanged in the contract ATM)
    function() external { }

}
