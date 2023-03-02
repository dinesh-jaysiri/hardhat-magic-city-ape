const { ethers } = require("hardhat")

async function togglePause() {
    const magicCityApe = await ethers.getContract("MagicCityApe")
    const togglePauseTx = await magicCityApe.togglePause()
    const togglePauseTXReceipt = await togglePauseTx.wait(1)

    console.log("Contract Pause toggled successfully")
}

togglePause()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
