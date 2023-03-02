const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { GenaratedMerkleTree } = require("../utils/genarateMerkleTree")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // Constractor arguments
    const BASE_URI = " ipfs://Qmdg7X717tXgZieubfhhshCHtcsWCsjXn4rMNTts3UdAJh/"
    const merkleroot = ethers.utils.hexlify(GenaratedMerkleTree.getRoot()) 
    const args = [BASE_URI, merkleroot]

    //deploy contract
    const magicCityApe = await deploy("MagicCityApe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    })


    log("----------- deploying magicCityApe contract is successfully -----------")
    log("merkalroot",merkleroot)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("----------- starting verification process -----------")

        await verify(magicCityApe.address, args)
    }
}

module.exports.tags = ["all", "magiccityape"]
