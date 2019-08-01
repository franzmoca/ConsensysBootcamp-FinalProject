var PetitionManager = artifacts.require('PetitionManager')
let catchRevert = require("./exceptionsHelpers.js").catchRevert
const BN = web3.utils.BN

contract('PetitionManager', function(accounts) {

    const deployAccount = accounts[0]
    const firstAccount = accounts[3]
    const secondAccount = accounts[4]
    const thirdAccount = accounts[5]

    const ticketPrice = 100

    let instance

    const user1 = {
        name: "Alice",
        ens: "alice.eth",
        ipfs_avatar: "ipfs://blabla"
    }

    const petition1 = {
        name: "Ban something!",
        link: "URL",
        description: "",
        ipfs_banner: "ipfs://blabla",
        targetSigns: "10"
    }


    beforeEach(async () => {
        instance = await PetitionManager.new()
    })

    describe("Setup", async() => {

        it("OWNER should be set to the deploying address", async() => {
            const owner = await instance.owner()
            assert.equal(owner, deployAccount, "the deploying address should be the owner")
        })
    })

    describe("Functions", () => {

       describe("createUser()", async() =>{
            it("cannot register the same user twice", async() => {
                await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} )
                await catchRevert(instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} ))
            })

            it("create user should emit an event with the provided user details", async() => {
                const tx =  await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} )
                const userData = tx.logs[0].args

                assert.equal(userData.name, user1.name, "the user names should match")
                assert.equal(userData.userAddress, firstAccount, "the user addresses should match")
            })
        })

        describe("createPetition()", async() =>{
            it("petitions should only be created only by users", async() => {                
                await catchRevert(instance.createPetition(petition1.name, petition1.description, petition1.link, petition1.ipfs_banner, petition1.targetSigns, {from: secondAccount}))
            })

            it("petition emit the correct event", async() => {
                //Create the user first:
                await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} )
                const tx = await instance.createPetition(petition1.name, petition1.description, petition1.link, petition1.ipfs_banner, petition1.targetSigns, {from: firstAccount})
                const petitionData = tx.logs[0].args
                assert.equal(petitionData.creator, firstAccount, "creator address should be correct")
                assert.equal(petitionData.petitionId, 0, "petitionId should be 0")

            })

        describe("signPetition()", async() =>{
            it("Cannot sign the same petition twice", async() => {
                await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} )
                await instance.createPetition(petition1.name, petition1.description, petition1.link, petition1.ipfs_banner, petition1.targetSigns, {from: firstAccount})
                await instance.signPetition(0, {from:firstAccount})  
                await catchRevert(instance.signPetition(0, {from:firstAccount}))
            })
        })

        describe("closePetition()", async() =>{
            it("an user cannot close the petition if is not the creator", async() => {
                await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} )
                await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: secondAccount} )
                await instance.createPetition(petition1.name, petition1.description, petition1.link, petition1.ipfs_banner, petition1.targetSigns, {from: firstAccount})
                await catchRevert(instance.closePetition(0, {from:secondAccount}) )
            }),
            it("a creator user can close his petition", async() => {
                await instance.createUser(user1.name, user1.ens, user1.ipfs_avatar, {from: firstAccount} )
                await instance.createPetition(petition1.name, petition1.description, petition1.link, petition1.ipfs_banner, petition1.targetSigns, {from: firstAccount})
                await instance.closePetition(0, {from:firstAccount}) })
            })
        })

    })
})
