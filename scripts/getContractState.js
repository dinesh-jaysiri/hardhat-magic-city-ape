const { ethers } = require("hardhat")

async function getContractState() {
    const magicCityApe = await ethers.getContract("MagicCityApe")
    const presaleM = await magicCityApe.presaleM()

    const publicM = await magicCityApe.publicM()
    const revealed = await magicCityApe.revealed()
    const paused = await magicCityApe.paused()

    console.log({presaleM,publicM,revealed,paused})

    
}

getContractState()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
