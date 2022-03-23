import { Interface } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { createTurboRouter } from './turboContracts'

// returns callData for a function call to be parsed through multicall
export const encodeRouterCall = (
    iface: Interface,
    functionName: string,
    params: any[]
  ): string =>  iface.encodeFunctionData(functionName, [...params])


export const decodeRouterCall = (
    iface: Interface,
    functionName: string,
    txResult: any
): any => iface.decodeFunctionResult(functionName, txResult);
  
  
export const callRouterWithMultiCall = async (
    hre: HardhatRuntimeEnvironment,
    encodedCalls: string[],
    id: number,
    simulatedAddress?: string,
  ) => {
    const router = await createTurboRouter(hre, id);

    let options: any = {};
    if (!!simulatedAddress) options.address = simulatedAddress;
  
    const returnDatas = await router.callStatic.multicall(
      encodedCalls,
      options
    );
  
    return returnDatas;
  };
  

  export const sendRouterWithMultiCall = async (
    hre: HardhatRuntimeEnvironment,
    encodedCalls: string[],
    id: number,
    simulatedAddress?: string
  ) => {
    const router = await createTurboRouter(hre, id);

    let options: any = {};
    if (!!simulatedAddress) options.address = simulatedAddress;
  
    const returnDatas = await router.multicall(
      encodedCalls,
      options
    );
  
    return returnDatas;
  };
  
