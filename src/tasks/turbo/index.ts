import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Colors
import colors from 'colors';

// Turbo ABIs
import Deployer from '../../turbo/abi/Deployer.sol/Deployer.json'
import DAIABI from '../../turbo/abi/DAI.sol/DAI.json'

// Ethers
import { Contract } from 'ethers';
import { getPermitDigest, sign } from '../../utils/signatures';

export * from './TurboMaster';
export * from './TurboRouter';
export * from './TurboComptroller';
export * from './TurboSafe';

task('query-deployer', 'Deploys a clean fuse instance', async (taskArgs, hre) => {
    const provider = new hre.ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')

    const turboContract = new Contract(
        '0xca8c8688914e0f7096c920146cd0ad85cd7ae8b9',
        Deployer.abi,
        provider
    )


    console.log(await turboContract.master())
})

task('gasless', "Will generate a signed message and call permit from the receiver's end", async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners()

    // Dai Contract
    const daiContract = new Contract(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        DAIABI,
        signers[1]
    )

    const name = await daiContract.name()
    const address = daiContract.address
    const nonces = await daiContract.nonces("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    const deadline = 100000000000000
    const privateKey = Buffer.from("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", "hex")
    const approve = {
        owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        spender: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        value: 100
    }

    console.log(privateKey)
    console.log(name, address, nonces)

    const digest = getPermitDigest(
        name,
        address,
        31337,
        approve,
        nonces,
        deadline
    )

    const {v,r,s} = sign(digest, privateKey)

    const receipt = await daiContract.permit(approve.owner, approve.spender, nonces, deadline, true, v, r, s)
    const event = receipt.logs[0]

    console.log(event)


})