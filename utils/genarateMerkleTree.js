
const keccak256 = require("keccak256")
const { MerkleTree } = require("merkletreejs") 


const whiteList = process.env.WHITELIST.split("|").map((adderss) => adderss.trim())

const leafNodes = whiteList.map((address) => keccak256(address))

const GenaratedMerkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
})

module.exports = {GenaratedMerkleTree}
