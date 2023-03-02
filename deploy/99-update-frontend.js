const { ethers, network } = require("hardhat")
const fs = require("fs")

const fronEndContractsFile = "../react-magiccityape/src/constants/networkMapping.json"
const frontendAbiLocation = "../react-magiccityape/src/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front-end...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("MagicCityApe")
    fs.writeFileSync(
        `${frontendAbiLocation}MagicCityApe.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const magicCityApe = await ethers.getContract("MagicCityApe")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(fronEndContractsFile, "utf8"))

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["MagicCityApe"].includes(magicCityApe.address)) {
            contractAddresses[chainId]["MagicCityApe"].unshift(magicCityApe.address)
        }
    } else {
        contractAddresses[chainId] = { MagicCityApe: [magicCityApe.address] }
    }

    fs.writeFileSync(fronEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
