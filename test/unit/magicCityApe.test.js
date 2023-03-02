const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("MagicCityApe", () => {
          let MagicCityApe, deployer, player_1, player_2
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              player_1 = (await getNamedAccounts()).player_1
              player_2 = (await getNamedAccounts()).player_2
              await deployments.fixture("all")

              MagicCityApe = await ethers.getContract("MagicCityApe", deployer)
          })

          describe("veriable", () => {
              it("maxsupply should be 100", async () => {
                  const MAX_SUPPLY = 100
                  const max_supply_from_contract = await MagicCityApe.maxSupply()
                  assert.equal(MAX_SUPPLY, max_supply_from_contract)
              })
          })

          describe("Constructor", () => {
              it("baseURI assigned Correctly", async () => {
                  const BASE_URI =
                      "https://ipfs.io/ipfs/Qmdg7X717tXgZieubfhhshCHtcsWCsjXn4rMNTts3UdAJh/"

                  const baseUriFromContract = await MagicCityApe.baseURI()
                  assert.equal(BASE_URI, baseUriFromContract)
              })
          })
      })
