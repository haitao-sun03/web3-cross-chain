const { expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")



let firstAccount;
let ccipLocalSimulator;
let nft;
let nftPoolLockAndRelease;
let wnft;
let nftPoolMintAndBurn;
let chainSelector;
before(async function () {
    firstAccount = (await getNamedAccounts()).firstAccount
    await deployments.fixture(["all"])

    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount);
    nft = await ethers.getContract("MyToken", firstAccount);
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
    wnft = await ethers.getContract("WrappedMyToken", firstAccount);
    nftPoolMintAndBurn = await ethers.getContract("NFTPoolMintAndBurn", firstAccount);
    const config = await ccipLocalSimulator.configuration();
    chainSelector = config.chainSelector_
})

describe("source chain -> dest chain", async function () {
    // test mint nft is successful
    it("test mint nft is successful",
        async function () {
            await nft.safeMint(firstAccount)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
        }
    )

    // test the nft can lock in lock the pool and send ccip message
    it("test the nft can lock in lock the pool and send send ccip message",
        async function () {
            // nft approve to nftPoolLockAndRelease
            await nft.approve(nftPoolLockAndRelease.target, 0)
            // nftPoolLockAndRelease gets some fee from simulator faucet
            await ccipLocalSimulator.requestLinkFromFaucet(
                nftPoolLockAndRelease,
                ethers.parseEther("10"))

            await nftPoolLockAndRelease.lockAndSendNFT(
                0,
                firstAccount,
                chainSelector,
                nftPoolMintAndBurn.target)

            const newOwner = await nft.ownerOf(0)
            expect(newOwner).to.equal(nftPoolLockAndRelease.target)
        }
    )


    // test mint a wrapped nft in dest chain
    it("test mint a wrapped nft in dest chain",
        async function () {
            const wnftOwner = await wnft.ownerOf(0)
            expect(wnftOwner).to.equal(firstAccount)
        }
    )
})

// function burnAndSendNFT(
//     uint256 tokenId,
//     address newOwner,
//     uint64 chainSelector,
//     address receiver) 
// dest chain -> source chain
describe("dest chain -> source chain",async function () {
    // test burn the wrapped nft in dest chain and send message to source chain
    it("test burn the wrapped nft in dest chain and send message to source chain",
        async function () {
            await wnft.approve(nftPoolMintAndBurn.target,0)
            await ccipLocalSimulator.requestLinkFromFaucet(
                    nftPoolMintAndBurn,
                    ethers.parseEther("10"))
            
            await nftPoolMintAndBurn.burnAndSendNFT(
                    0,
                    firstAccount,
                    chainSelector,
                    nftPoolLockAndRelease.target)

            const totalSupply = await wnft.totalSupply()
            expect(totalSupply).to.equal(0)
        }
    )

    // test unlock the nft
    it("test unlock the nft",
        async function () {
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
        }
    )

    
    
})












