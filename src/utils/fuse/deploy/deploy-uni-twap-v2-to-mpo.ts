// Types
import { Fuse } from '../../../../cjs';

// Colors
import colors from 'colors';
import { Contract } from 'ethers';
import { Interface } from 'ethers/lib/utils';

export async function deployUniTwapV2ToMpo(
    comptrollerAddress: string,
    uniV3BaseTokenAddress: string,
    fuse: Fuse,
    address?: string
) {

    console.info(
        colors.yellow(
            "Initiating UniswapTwapV2 deployment."
        )
    )

    // 1. Deploy UniswapTwapV2 oracle.
    const uniswapTwapOracle = await fuse.deployPriceOracle(
        "UniswapTwapPriceOracleV2",
        { baseToken: uniV3BaseTokenAddress },
        { from: address }
    )

    console.info(
        colors.green(
            "Deployment successful!"
        )
    )

    console.table(
        {contract: "UniswapTwapV2Oracle" , address: uniswapTwapOracle}
    )

    console.info(
        colors.yellow(
            "Configuring MasterPriceOracle."
        )
    )

    // const comptrollerInterface = new Interface([
    //     'function oracle() external view returns (address)'
    // ])

    // const comptrollerContract = new Contract(
    //     comptrollerAddress,
    //     comptrollerInterface,
    //     fuse.provider
    // )

    // const oracleAddress = await comptrollerContract.oracle()

    // const oracleInterface = new Interface([
    //     'function add(address[] calldata underlyings, tuple[] calldata _oracles) external onlyAdmin'
    // ])

    // const oracleContract = new Contract(
    //     oracleAddress,
    //     oracleInterface,
    //     fuse.provider
    // )

    // await oracleContract.add(tokenArray, oracleAddress, {
    //     from: address,
    //   });

}