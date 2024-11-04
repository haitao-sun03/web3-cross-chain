const { network } = require("hardhat");
const {devlepmentChains} = require("../helper.hardhat.config")
module.exports = async ({getNamedAccounts,deployments}) => {

    if(!devlepmentChains.include(network.name)) {
        console.log("not local or hardhat network,skipped")
        return
    }
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("CCIP Simulator deploying...")
    await deploy("CCIPLocalSimulator",{
        contract:"CCIPLocalSimulator",
        from: firstAccount,
        log: true,
        args: []
    })

    log("CCIP Simulator deploy successfully")
    
}
module.exports.tags=["all","test"]
