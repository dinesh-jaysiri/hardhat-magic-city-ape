const { ethers } = require("hardhat")

async function reveal() {
    const magicCityApe = await ethers.getContract("MagicCityApe")
    const revealTx = await magicCityApe.reveal()
    const revealTXReceipt = await revealTx.wait(1)

    console.log("Contract Reveal successfully")
}

reveal()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
