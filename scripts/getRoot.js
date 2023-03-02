const { ethers } = require("hardhat")

async function getRoot() {
    const magicCityApe = await ethers.getContract("MagicCityApe")

    const root = await magicCityApe.root()
    console.log("root: ",root)
}

getRoot()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
