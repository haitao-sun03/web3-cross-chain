const {task} = require("hardhat/config")

task("mint-nft").setAction(async (taskArgs,hre) => {
    const {firstAccount} = await getNamedAccounts()
    const nft = await ethers.getContract("MyToken",firstAccount)

    console.log("nft minting...")
    const mintTx = await nft.safeMint(firstAccount)
    await mintTx.wait()
    console.log("nft minted")
})