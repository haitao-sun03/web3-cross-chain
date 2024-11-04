
module.exports = async ({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("nft deploying...")
    await deploy("MyToken",{
        contract:"MyToken",
        from: firstAccount,
        log: true,
        args: ["MyToken","MT"]
    })

    log("nft contract deploy successfully")
    
}
module.exports.tags=["all","sourcechain"]
