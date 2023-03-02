const { ethers } = require("hardhat")

async function getmaxSupply() {
    const magicCityApe = await ethers.getContract("MagicCityApe")
    const maxSupply = await magicCityApe.maxSupply()
    // const getmaxSupplyTXReceipt = await getmaxSupplyTX.wait(1)

    console.log(maxSupply.toString())
}

getmaxSupply()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
