const {task} = require("hardhat/config")
const {networkConfig} = require("../helper.hardhat.config")

task("lock-and-cross")
    .addParam("tokenid","nft's owner")
    .addOptionalParam("chainselector","selector of the dest chain")
    .addOptionalParam("receiver","dest chain receiver address")
    .setAction(async (taskArgs,hre) => {
        let chainSelector
        let receiver
        const tokenId = taskArgs.tokenid
        const {firstAccount} = await getNamedAccounts()

        if(taskArgs.chainselector) {
            chainSelector = taskArgs.chainselector
        }else {
            chainSelector = networkConfig[network.config.chainId].companionChainSelector
            console.log("chainselector is not set in command")
        }
        console.log(`chainselector is ${chainSelector}`)

        if(taskArgs.receiver) {
            receiver = taskArgs.receiver
        }else {
            const nftPoolMintAndBurn = await hre.companionNetworks["destChain"].deployments.get("NFTPoolMintAndBurn")
            receiver = nftPoolMintAndBurn.address
            console.log("receiver is not set in command")
        }
        console.log(`receiver address is ${receiver}`)

        // transfer some link to NFTLockAndReleasePool through linkERC20 
        // const linkTokenAddr = networkConfig[network.config.chainId].linkToken
        // const linkToken = await ethers.getContractAt("LinkToken",linkTokenAddr)
        const nftLockAndReleasePool = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)


        // console.log(`link fee before is ${await linkToken.balanceOf(nftLockAndReleasePool.target)}`)
        // const tranferTx = await linkToken.transfer(nftLockAndReleasePool.target,ethers.parseEther("10"))
        // await tranferTx.wait(6)
        // console.log(`link fee after is ${await linkToken.balanceOf(nftLockAndReleasePool.target)}`)



        // appove to NFTLockAndReleasePool through MyToken
        // const nft = await ethers.getContract("MyToken",firstAccount)
        // nft.approve(nftLockAndReleasePool.target,tokenid)
        // console.log("approve successfully")

        // lockAndSendNFT
        console.log(`${tokenId}, ${firstAccount}, ${chainSelector}, ${receiver}`)
        const lockAndCrossTx = await nftLockAndReleasePool
            .lockAndSendNFT(
            tokenId, 
            firstAccount, 
            chainSelector, 
            receiver
        )

        console.log(`NFT locked and crossed, transaction hash is ${lockAndCrossTx.hash}`)

    })

    module.exports = {}

