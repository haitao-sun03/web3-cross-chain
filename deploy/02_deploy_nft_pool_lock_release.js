const { ethers, network } = require("hardhat")
const {devlepmentChains,networkConfig} = require("../helper.hardhat.config")


module.exports = async ({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = await deployments


    let sourceRouter
    let linkToken

    if(devlepmentChains.includes(network.name)) {
        const CCIPLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
        const CCIPLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator",CCIPLocalSimulatorDeployment.address)
        const config = await CCIPLocalSimulator.configuration()
        sourceRouter = config.sourceRouter_
        linkToken = config.linkToken_
    }else {
        sourceRouter = networkConfig[network.config.chainId].router
        linkToken = networkConfig[network.config.chainId].linkToken
    }
    

    const MyTokenDeployment = await deployments.get("MyToken")


    log("NFTPoolLockAndRelease deploying...")

    // address _router, address _link,address nftAddr
    await deploy("NFTPoolLockAndRelease",{
        contract: "NFTPoolLockAndRelease",
        from : firstAccount,
        log : true,
        args: [sourceRouter,linkToken,MyTokenDeployment.address]
    })

    log("NFTPoolLockAndRelease deploy successfully")
}

module.exports.tags = ["sourcechain","all"]