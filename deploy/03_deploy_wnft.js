
module.exports = async ({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("wnft deploying...")
    await deploy("WrappedMyToken",{
        contract:"WrappedMyToken",
        from: firstAccount,
        log: true,
        args: ["WrappedMyToken","WMT"]
    })

    log("wnft contract deploy successfully")
    
}
module.exports.tags=["all","destchain"]
