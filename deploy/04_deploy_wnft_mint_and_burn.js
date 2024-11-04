const { ethers } = require("hardhat")
const {devlepmentChains,networkConfig} = require("../helper.hardhat.config")

module.exports = async ({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = await deployments

    let destinationRouter
    let linkToken
    if(devlepmentChains.includes(network.name)) {
        const CCIPLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
        const CCIPLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator",CCIPLocalSimulatorDeployment.address)
        const config = await CCIPLocalSimulator.configuration()
        destinationRouter = config.destinationRouter_
        linkToken = config.linkToken_
    }else {
        destinationRouter = networkConfig[network.config.chainId].router
        linkToken = networkConfig[network.config.chainId].linkToken
    }
    

    const wrappedMyTokenDeployment = await deployments.get("WrappedMyToken")


    log("NFTPoolMintAndBurn deploying...")

    // address _router, address _link,address nftAddr
    await deploy("NFTPoolMintAndBurn",{
        contract: "NFTPoolMintAndBurn",
        from : firstAccount,
        log : true,
        args: [destinationRouter,linkToken,wrappedMyTokenDeployment.address]
    })

    log("NFTPoolMintAndBurn deploy successfully")
}

module.exports.tags = ["destchain","all"]