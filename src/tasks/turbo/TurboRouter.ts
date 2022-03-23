import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { BigNumber, Contract } from "ethers";
import { TurboAddresses, TRIBE } from "./utils/constants";
import { JsonRpcSigner } from "@ethersproject/providers";

// Utils
import { parseEther } from "ethers/lib/utils";
import { checkAllowance, balanceOf } from "../../utils/erc20";
import { callRouterWithMultiCall, encodeRouterCall, decodeRouterCall, sendRouterWithMultiCall } from "./utils/turboMulticall";
import { createERC20, createTurboRouter, ITurboRouter } from "./utils/turboContracts"
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("create-safe", "Will create an empty safe")
  .addParam('id', 'chainID')
  .setAction( async (taskArgs, hre) => {
  const turboRouterContract = await createTurboRouter(hre, taskArgs.id);

  const receipt = await turboRouterContract.createSafe(TRIBE);

  console.log({ receipt });
});

task("approve-router", "Will approve router")
  .addParam('id', 'chainID') 
  .setAction( async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();

  const tribe = await createERC20(hre, TRIBE);

  const receipt = await tribe.approve(
    TurboAddresses[taskArgs.id].ROUTER,
    parseEther("50000000")
  );

  console.log({ receipt });
});

task("create-safe-and-deposit", "")
  .addParam('id', 'chainID')
  .setAction(async (taskArgs, hre) => {
  const turboRouterContract = await createTurboRouter(hre, taskArgs.id);
  const receipt = await turboRouterContract.createSafeAndDeposit(
    "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    parseEther("100"),
    parseEther("100")
  );

  console.log({ receipt });
});

task("router-create-safe")
  .addParam('id', 'chainID')
  .setAction( async (taskArgs, hre) => {
  const turboRouterContract = await createTurboRouter(hre, taskArgs.id);
  const receipt = await turboRouterContract.createSafe(TRIBE);

  console.log({ receipt });
});

task("router-create-safe-and-deposit-and-boost")
  .addParam('id', 'chainID')
  .setAction(async (taskArgs, hre) => {
  const turboRouterContract = await createTurboRouter(hre, taskArgs.id);

  const receipt = turboRouterContract.createSafeAndDepositAndBoost
})

task("", "Will deposit to given safe")
  .addParam("amount", "amount of TRIBE to collateralize")
  .addParam("vault", "Vault to boost")
  .addParam("boost", "Amount to boost")
  .addParam('id', 'chainID')
  .setAction(async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();

  const userAddress = signers[0].address;

  const amount = parseEther(taskArgs.amount);

  const approvdeArgs = [TRIBE, TurboAddresses[taskArgs.id].ROUTER, amount]
  const pullTokensArgs = [TRIBE, amount, TurboAddresses[taskArgs.id].ROUTER];
  const createAndDepositAndBoostArgs = [TRIBE, userAddress, amount, amount, taskArgs.vault, parseEther(taskArgs.boost)];

  const encodeApprove = encodeRouterCall(
    ITurboRouter,
    "approve",
    approvdeArgs
  )
  const encodedPullTokens = encodeRouterCall(
    ITurboRouter,
    "pullTokens",
    pullTokensArgs
  )

  const encodedContractCall = encodeRouterCall(
    ITurboRouter,
    "createSafeAndDepositAndBoost",
    createAndDepositAndBoostArgs
  )

  const encodedCalls = [encodedPullTokens, encodedContractCall];
  const approveFirst = [encodeApprove, encodedPullTokens, encodedContractCall];

  const hasApproval = await checkAllowance(
    userAddress,
    TurboAddresses[taskArgs.id].ROUTER,
    TRIBE,
    amount,
    signers[0]
  );

  const preBalanceRouter = await balanceOf(
    TurboAddresses[taskArgs.id].ROUTER,
    TRIBE,
    signers[0]
  );
  const preBalanceUser = await balanceOf(userAddress, TRIBE, signers[0]);

  let receipt
  if (hasApproval) {
    receipt = await sendRouterWithMultiCall(hre, encodedCalls, taskArgs.id);
  } else {
    receipt = await sendRouterWithMultiCall(hre, approveFirst, taskArgs.id)
  }


  const postBalanceRouter = await balanceOf(
    TurboAddresses[taskArgs.id].ROUTER,
    TRIBE,
    signers[0]
  );

  const postBalanceUser = await balanceOf(userAddress, TRIBE, signers[0]);


  console.log(preBalanceRouter, preBalanceUser, receipt, postBalanceRouter, postBalanceUser)

});

/**  Multicalls **/
task(
  "get-constants",
  "Will get constants with a multicall")
  .addParam('id', 'chainID')
  .setAction(
  async (taskArgs, hre) => {
    const masterCall = encodeRouterCall(ITurboRouter, "master", []);
    const WETH9 = encodeRouterCall(ITurboRouter, "WETH9", []);

    const answer = await callRouterWithMultiCall(hre, [masterCall, WETH9], taskArgs.id);

    console.log({ answer });
  }
);

task("multicall-create-safe-and-deposit")
  .addParam('id', 'chainID')
  .setAction(async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();

  const userAddress = signers[0].address;

  const amount = parseEther("1");

  const pullTokensArgs = [TRIBE, amount, TurboAddresses[taskArgs.id].ROUTER];

  const createAndDepositArgs = [TRIBE, userAddress, amount, amount];

  const encodedCreateSafeAndDeposit = encodeRouterCall(
    ITurboRouter,
    "createSafeAndDeposit",
    createAndDepositArgs
  );

  const encodedPullTokens = encodeRouterCall(
    ITurboRouter,
    "pullTokens",
    pullTokensArgs
  )

  const encodedCalls = [encodedPullTokens, encodedCreateSafeAndDeposit];

  const hasApproval = await checkAllowance(
    userAddress,
    TurboAddresses[taskArgs.id].ROUTER,
    TRIBE,
    amount,
    signers[0]
  );

  if (hasApproval) {
    const preBalanceRouter = await balanceOf(
      TurboAddresses[taskArgs.id].ROUTER,
      TRIBE,
      signers[0]
    );
    const preBalanceUser = await balanceOf(userAddress, TRIBE, signers[0]);

    const answer = await sendRouterWithMultiCall(hre, encodedCalls, taskArgs.id);

    const postBalanceRouter = await balanceOf(
      TurboAddresses[taskArgs.id].ROUTER,
      TRIBE,
      signers[0]
    );

    const postBalanceUser = await balanceOf(userAddress, TRIBE, signers[0]);

    // const newSafe = decodeCall(ITurboRouter, 'createSafeAndDeposit', answer[1])
    
    console.log({preBalanceRouter, preBalanceUser, postBalanceRouter, postBalanceUser, answer })

  }

});

/** Unit Funcs **/
task(
  "pull-tokens",
  "Will pull tokens into the router")
  .addParam('id', 'chainID')
  .setAction(
  async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners();

    const tribe = await createERC20(hre, TRIBE);
    const router = await createTurboRouter(hre, taskArgs.id);

    const amount = parseEther("1");

    // Check balance of Router before calling pullTokens
    const preBalanceRouter = await balanceOf(
      TurboAddresses[taskArgs.id].ROUTER,
      TRIBE,
      signers[0]
    );
    const preBalanceUser = await balanceOf(
      signers[0].address,
      TRIBE,
      signers[0]
    );

    const hasApproval = await checkAllowance(
      signers[0].address,
      TurboAddresses[taskArgs.id].ROUTER,
      TRIBE,
      amount,
      signers[0]
    );

    console.log({ preBalanceRouter, preBalanceUser, hasApproval });

    if (hasApproval) {
      const receipt = await router.pullToken(
        TRIBE,
        amount,
        TurboAddresses[taskArgs.id].ROUTER
      );

      console.log({ receipt });

      const postBalanceRouter = await balanceOf(
        TurboAddresses[taskArgs.id].ROUTER,
        TRIBE,
        signers[0]
      );
      const postBalanceUser = await balanceOf(
        signers[0].address,
        TRIBE,
        signers[0]
      );

      console.log({ postBalanceRouter, postBalanceUser });
    }
  }
);

task(
  "check-router-approval",
  "Checks if User has approved token for Router")
  .addParam('id', 'chainID')
  .setAction(
  async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners();
    const approval = await checkAllowance(
      signers[0].address,
      TurboAddresses[taskArgs.id].ROUTER,
      TRIBE,
      parseEther("1"),
      signers[0]
    );
    console.log({ approval });
  }
);


/// UTIL

const pullTokens = async (
  userAddress: string,
  amount: BigNumber,
  signer: JsonRpcSigner,
  routerContract: Contract,
  hre: HardhatRuntimeEnvironment,
  id: number
) => {
  const hasApproval = await checkAllowance(
      userAddress,
      TurboAddresses[id].ROUTER,
      TRIBE,
      amount,
      signer
  )

  let receipt
  if (hasApproval) {
      receipt = await routerContract.pullToken(
          TRIBE,
          amount,
          TurboAddresses[id].ROUTER
      );

  } else {
    const tribe = await createERC20(hre, TRIBE);

    await tribe.approve(
      TurboAddresses[id].ROUTER,
      amount
    );

    receipt = await routerContract.pullToken(
      TRIBE,
      amount,
      TurboAddresses[id].ROUTER
    );
  }

  console.log(receipt)

}