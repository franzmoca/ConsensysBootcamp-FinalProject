var PetitionManager = artifacts.require("PetitionManager");

module.exports = function(deployer) {
  deployer.deploy(PetitionManager);
};
