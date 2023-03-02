const { ethers } = require("hardhat")

async function togglePresale() {
    const magicCityApe = await ethers.getContract("MagicCityApe")
    const togglePresaleTx = await magicCityApe.togglePresale()
    const togglePresaleTXReceipt = await togglePresaleTx.wait(1)

    console.log("Presale toggled successfully")
}

togglePresale()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
