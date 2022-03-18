// import '@nomiclabs/hardhat-ethers';
// import { task } from 'hardhat/config';

// // Fuse SDK
// import Fuse from '../../cjs/Fuse';
// import { BigNumber } from 'ethers';

// // Hardhat helpers
// import { configureEnv } from '../utils';
// import { fetchCTokenData } from '../../@rari-capital/fetch-data/fetch-ctoken-data';
// import { fetchFusePoolData } from '../../@rari-capital/fetch-data/fetch-fuse-pool-data';
// import { getPoolAssetsWithData } from '../../@rari-capital/lens';

// import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
// import { Contract } from '@ethersproject/contracts';
// import { Interface } from '@ethersproject/abi'
// import { parseUnits } from '@ethersproject/units';
// import { getDecimals } from '../utils/fuse/market-interactions/market-interaction';

// task('get-pool-info', 'Will return given pool\'s info')
//         .addParam("comptroller", "Pool's comptroller address.")
//         .addOptionalParam("address", "Will be used to get address' balances in available markets.")
//         .setAction(async (taskArgs, hre) => {
//         const {address, fuse, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const data = await getPoolAssetsWithData(
//                 fuse.provider,
//                 fuse.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS,
//                 taskArgs.comptroller,
//         )

//         console.log(data)
// })

// task('get-market-data', 'Will return given markets\'s info')
//         .addParam("market", "Address of market to look for.")
//         .addOptionalParam("comptroller", "Address of comptroller where market is listed.")
//         .setAction(async (taskArgs, hre) => {
//         const {address, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const data = await fetchCTokenData(
//                 taskArgs.market,
//                 taskArgs.comptroller,
//                 provider
//         )

//         console.log(data)
// })

// task("fetch-fuse-pool-data", async (taskArgs, hre) => {
//         const {address, fuse, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await fetchFusePoolData(
//                 fuse,
//                 "1",
//                 address
//         )
//         console.log(answer)
// })

// task("fetch-rewards", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await fetchRewardDistributorsInPool(
//                 '0x42053c258b5cd0b7f575e180DE4B90763cC2358b',
//                 provider,
//         )      
//         console.log(answer) 

//         const answer2 = await fetchRewardTokensInRd(
//                 answer[0],
//                 provider
//         )
//         console.log(answer2)


//         const answer3 = await fetchRewardedMarketsInRd(
//                 answer[0],
//                 provider
//         )
//         console.log(answer3)

// })

// task("set-rewards-speed")
//         .addParam('speed', 'Amount of tokens distributed per block.')
//         .addParam('rdaddress','Reward distributor address.')
//         .addParam('tokendecimals', 'Rewarded token decimals')
//         .addParam('market', 'Address of market youre setting speed for.')
//         .setAction( async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await setSupplySpeed(
//                 taskArgs.speed,
//                 taskArgs.rdaddress,
//                 taskArgs.tokendecimals,
//                 taskArgs.market,
//                 provider,
//         )      
//         console.log(answer) 
// })


// task("get-rewards-speed-in-market", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await getSpeed(
//                 '0x5302E909d1e93e30F05B5D6Eea766363D14F9892',
//                 '0xdeF5E280FCE2381ff5091Aeb13Bf7E44ca3c4Ad1',
//                 provider,
//                 'supply'
//         )

//         const answer2 = await getSpeed(
//                 '0x5302E909d1e93e30F05B5D6Eea766363D14F9892',
//                 '0xdeF5E280FCE2381ff5091Aeb13Bf7E44ca3c4Ad1',
//                 provider,
//                 'borrow'
//         )
//         console.log(answer, answer2) 
// })

// task('extra', async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await extraPoolInfo('0x42053c258b5cd0b7f575e180DE4B90763cC2358b', provider)
//         console.log(answer)
// })

// task("get-price-from-oracle", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await getPriceFromOracle(
//                 '0x6b175474e89094c44da98b954eedeac495271d0f',
//                 '0xc60d11e23fc0e61A833f2c83ba2d764464704062',
//                 provider
//         )

//         console.log(answer)

// })

// task("get-reward-apy-for-market", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const rdAddress = '0x5302E909d1e93e30F05B5D6Eea766363D14F9892'
//         const marketAddress = '0xdeF5E280FCE2381ff5091Aeb13Bf7E44ca3c4Ad1'
//         const oracleAddress = '0xc60d11e23fc0e61A833f2c83ba2d764464704062'
//         const comptrollerAddress = '0x42053c258b5cd0b7f575e180DE4B90763cC2358b'

//         const rewardSpeed = await getSpeed(
//                 rdAddress,
//                 marketAddress,
//                 provider,
//                 'supply'
//         )

//         const rdToken = await fetchRewardTokensInRd(
//                 rdAddress,
//                 provider
//         )

//         const rdTokenDecimals = await getDecimals(rdToken, provider)

//         const rewardEthPrice = await getPriceFromOracle(
//                 rdToken,
//                 oracleAddress,
//                 provider
//         )

//         console.log(rewardEthPrice)

//         const underlying = await getPoolAssetsWithData(
//                 fuse.provider,
//                 fuse.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS,
//                 comptrollerAddress,
//         )

//         console.log(underlying)
//         const mantissa = constructMantissa(
//                 rewardSpeed,
//                 rewardEthPrice,
//                 underlying[1].totalSupply,
//                 underlying[1].underlyingPrice,
//                 rdTokenDecimals,
//                 underlying[1].underlyingDecimals,
//         )

//         console.log(mantissa)

//         const supplyAPY = convertMantissaToAPY(mantissa, 365);
//         const supplyAPR = convertMantissaToAPR(mantissa);

//         console.log(supplyAPR, supplyAPY)
// })

// task("get-rewards-apy", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const comptrollerAddress = '0x42053c258b5cd0b7f575e180DE4B90763cC2358b'
//         const oracleAddress = '0xc60d11e23fc0e61A833f2c83ba2d764464704062'

//         const answer = await fetchRewardDistributorsInPool(
//                 comptrollerAddress,
//                 provider,
//         )      

//         let mapping: any = {}

//         for (const rd in answer) {
//                 const rdAddress = answer[rd]
//                 mapping[rdAddress] = {}

//                 const marketsInRd = await fetchRewardedMarketsInRd(answer[rd], provider)
//                 const rdToken = await fetchRewardTokensInRd(
//                         rdAddress,
//                         provider
//                 )
//                 const rdTokenDecimals = await getDecimals(rdToken, provider)
//                 const rewardEthPrice = await getPriceFromOracle(
//                         rdToken,
//                         oracleAddress,
//                         provider
//                 )

                
//                 for (const market in marketsInRd) {
//                         const marketAddress = marketsInRd[market]

//                         const supplyRewardSpeed = await getSpeed(
//                                 answer[rd],
//                                 marketsInRd[market],
//                                 provider,
//                                 'supply'
//                         )

//                         const borrowRewardSpeed = await getSpeed(
//                                 answer[rd],
//                                 marketsInRd[market],
//                                 provider,
//                                 'borrow'
//                         )

//                         const underlying = await getPoolAssetsWithData(
//                                 fuse.provider,
//                                 fuse.addresses.FUSE_POOL_LENS_CONTRACT_ADDRESS,
//                                 comptrollerAddress,
//                         )

//                         console.log(underlying, underlying.name)

//                         const supplyMantissa = constructMantissa(
//                                 supplyRewardSpeed,
//                                 rewardEthPrice,
//                                 underlying[1].totalSupply,
//                                 underlying[1].underlyingPrice,
//                                 rdTokenDecimals,
//                                 underlying[1].underlyingDecimals,
//                         )

//                         const borrowMantissa = constructMantissa(
//                                 borrowRewardSpeed,
//                                 rewardEthPrice,
//                                 underlying[1].totalSupply,
//                                 underlying[1].underlyingPrice,
//                                 rdTokenDecimals,
//                                 underlying[1].underlyingDecimals,
//                         )

//                         const supplyAPY = convertMantissaToAPY(supplyMantissa, 365);
//                         const supplyAPR = convertMantissaToAPR(supplyMantissa);

//                         const borrowAPY = convertMantissaToAPY(borrowMantissa, 365);
//                         const borrowAPR = convertMantissaToAPR(borrowMantissa);

//                         mapping[rdAddress][marketAddress] = {
//                                 supplyAPR,
//                                 supplyAPY,
//                                 borrowAPR,
//                                 borrowAPY,
//                                 rdToken
//                         }

//                         console.log({supplyAPR, supplyAPY, borrowAPR, borrowAPY})
//                 }
//         }

//         console.log(mapping)
// })

// task("hey", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const answer = await fetchAvailableRds('0x42053c258b5cd0b7f575e180DE4B90763cC2358b', provider)
//         console.log(answer)
// })

// task("idk", async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const flywheelInterface = new Interface([
//                 'function isFlywheel() view returns (boolean)',
//                 'function isRewardsDistributor() public returns (boolean)',
//               ])  // Try calling `isFlywheel` if revert then coerce it into rewardsDistributor
      
//         const rdContract = new Contract(
//                 "0x5302E909d1e93e30F05B5D6Eea766363D14F9892",
//                 flywheelInterface,
//                 provider
//         )   

//         let isFlywheel =  await rdContract.callStatic.isRewardsDistributor();
//         console.log(isFlywheel)

// })

// task("hello",async (taskArgs, hre) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const cTokenAddress = '0xB8DA336A58a13D9F09FaA41570cAAf5Ec4879266'
//         const oracleAddress = '0xc60d11e23fc0e61A833f2c83ba2d764464704062'

//         const cTokenInterface = new Interface([
//                 'function getCash() external view returns (uint)',
//                 'function totalReserves() external view returns (uint)',
//                 'function totalAdminFees() external view returns (uint)',
//                 'function totalFuseFees() external view returns (uint)',
//                 'function totalBorrowsCurrent() external returns (uint)',
//                 'function isCEther() external view returns (bool)',
//                 'function underlying() external view returns (address)',
//                 'function borrowRatePerBlock() external view returns (uint)',
//                 'function supplyRatePerBlock() external view returns (uint)',
//                 'function balanceOfUnderlying(address owner) external returns (uint)',
//                 'function borrowBalanceStored(address account) external view returns (uint)',
//                 'function exchangeRateStored() external view returns (uint)'
//             ])

//         const cTokenContract = new Contract(
//                 cTokenAddress,
//                 cTokenInterface,
//                 provider
//         )
//         const supplyRatePerBlock = await cTokenContract.callStatic.supplyRatePerBlock()
//         const borrowRatePerBlock = await cTokenContract.callStatic.borrowRatePerBlock()
//         const liquidity = await cTokenContract.callStatic.getCash()
//         const totalBorrow = await cTokenContract.callStatic.totalBorrowsCurrent()
//         const totalReserves = await cTokenContract.callStatic.totalReserves()
//         const totalAdminFees = await cTokenContract.callStatic.totalAdminFees()
//         const totalFuseFees = await cTokenContract.callStatic.totalFuseFees()
//         const totalSupply = liquidity.add(totalBorrow).sub(totalReserves.add(totalAdminFees).add(totalFuseFees))
//         const supplyBalance = await cTokenContract.callStatic.balanceOfUnderlying(address)
//         const borrowBalance = await cTokenContract.callStatic.borrowBalanceStored(address)
//         const exchangeRateStored = await cTokenContract.callStatic.exchangeRateStored()
//         const isCEther = cTokenContract.isCEther()
        
//         let underlyingToken
//         let underlyingName
//         let underlyingSymbol
//         let underlyingDecimals
//         let underlyingBalance
//         let underlyingPrice
//         if (isCEther) {
//                 underlyingToken = "0x0000000000000000000000000000000000000000"
//                 underlyingName = "Ethereum"
//                 underlyingSymbol = "ETH"
//                 underlyingDecimals = 18
//                 underlyingBalance = provider.getBalance(address)
//                 underlyingPrice = hre.ethers.constants.WeiPerEther
//         } else {
//                 const underlyingAddress = await cTokenContract.underlying()

                

//                 const ERC20Interface = new Interface([
//                         'function name() public view returns (string)',
//                         'function symbol() public view returns (string)',
//                         'function decimals() public view returns (uint8)',
//                         'function balanceOf(address _owner) public view returns (uint256 balance)'
//                 ]) 

//                 const ERC20Contract = new Contract(
//                         underlyingAddress,
//                         ERC20Interface,
//                         provider
//                 )

//                 underlyingToken = underlyingAddress
//                 underlyingName = await ERC20Contract.callStatic.name()
//                 underlyingSymbol = await ERC20Contract.callStatic.symbol()
//                 underlyingDecimals = await ERC20Contract.callStatic.decimals()
//                 underlyingBalance = await ERC20Contract.callStatic.balanceOf(address)
//                 underlyingPrice = await getPriceFromOracle(underlyingToken, oracleAddress, provider)
//         }

//         console.log({
//                supplyRatePerBlock,
//                borrowRatePerBlock,
//                liquidity,
//                totalBorrow,
//                totalSupply,
//                supplyBalance,
//                borrowBalance,
//                exchangeRateStored,      
//                underlyingToken,
//                underlyingName,
//                underlyingDecimals,
//                underlyingBalance,
//                underlyingPrice
//         })
// })

// task("imp",async (taskArgs, hre ) => {
//         const {address, fuse, provider, fuseDeployed} = await configureEnv(hre)
//         if (!fuseDeployed) return

//         const contractInterface = new Interface([
//                 'function implementation() view returns (address)'
//         ])

//         const actualContract = new Contract(
//                 '0xB8DA336A58a13D9F09FaA41570cAAf5Ec4879266',
//                 contractInterface,
//                 provider
//         )

//         const answer = await actualContract.implementation()
//         console.log(answer)
// })

// export async function fetchAvailableRds(
//         comptrollerAddress: string,
//         provider: any
//       ): Promise<any[]> {
//               console.log('test')
//         const comptrollerInterface = new Interface([
//                 'function getRewardsDistributors() external view returns (address[] memory)'
//         ])
    
//         const flywheelInterface = new Interface([
//           'function isFlywheel() view returns (boolean)',
//           'function isRewardsDistributor() external view returns (boolean)',
//         ])  // Try calling `isFlywheel` if revert then coerce it into rewardsDistributor
      
        
//         const comptrollerContract = new Contract(
//           comptrollerAddress,
//           comptrollerInterface,
//           provider
//         )
    
//         console.log('hello')
//         const availableRds = await comptrollerContract.callStatic.getRewardsDistributors()
    
//         const rewardsDistributorWithContext: RewardsDistributorData[] = await Promise.all(availableRds
//         .map(async (rdAddress: any) => {
//                 const rdContract = new Contract(
//                 rdAddress,
//                 flywheelInterface,
//                 provider
//                 )
      
//                 let isFlywheel =  await rdContract.callStatic.isFlywheel();
//                 let isRewardsDistributor = false;

//                 // Check for Flywheel or isRewardsDistributor
//                 try { 
//                         isFlywheel = await rdContract.callStatic.isFlywheel();
//                         console.log(isFlywheel)
//                 } catch {
//                         // If not flywheel, check for RD
//                         try {
//                                 isRewardsDistributor = await rdContract.callStatic.isRewardsDistributor();
//                                 console.log(isRewardsDistributor)
//                         } catch {
//                                 return
//                         }
//                 }
      
//           const data: RewardsDistributorData = {
//             address: rdAddress,
//             isRewardsDistributor,
//             isFlywheel
//           }
//           return data
//         }))

        

//         console.log(rewardsDistributorWithContext)
    
    
//         return rewardsDistributorWithContext
//     }

//     export interface RewardsDistributorData {
//         address: string
//         isRewardsDistributor: boolean
//         isFlywheel: boolean
//       }
// export const fetchRewardDistributorsInPool = (
//         comptrollerAddress: string,
//         provider: Web3Provider | JsonRpcProvider,
//       ): Promise<any> => {
//         const comptrollerInterface = new Interface([
//                 'function getRewardsDistributors() external view returns (address[] memory)'
//         ])
        
//         const comptrollerContract = new Contract(
//           comptrollerAddress,
//           comptrollerInterface,
//           provider
//         )
    
//         return comptrollerContract.callStatic.getRewardsDistributors()
// }

// export const fetchRewardTokensInRd = (
//         rdAddress : string,
//         provider: Web3Provider | JsonRpcProvider,
//       ): Promise<any> => {
//         const rdInterface = new Interface([
//                 'function rewardToken() view returns (address)'
//         ])
        
//         const rdContract = new Contract(
//           rdAddress,
//           rdInterface,
//           provider
//         )
    
//         return rdContract.callStatic.rewardToken()
// }

// export const fetchRewardedMarketsInRd = (
//         rdAddress : string,
//         provider: Web3Provider | JsonRpcProvider,
// ): Promise<any> => {
//         const rdInterface = new Interface([
//                 'function getAllMarkets() view returns (address[])'
//         ])
        
//         const rdContract = new Contract(
//           rdAddress,
//           rdInterface,
//           provider
//         )
    
//         return rdContract.callStatic.getAllMarkets()
// }

// export const setSupplySpeed = (
//         supplySpeed: string,
//         rdAddress: string,
//         rdUnderlyingDecimals: string,
//         marketAddress: string,
//         provider: Web3Provider | JsonRpcProvider,
// ) => {
//         const rdInterface = new Interface([
//                 'function _setCompSupplySpeed(address cToken, uint compSpeed) public'
//         ])

//         const rdContract = new Contract(
//                 rdAddress,
//                 rdInterface,
//                 provider.getSigner()
//         )

//         const supplySpeedBN = parseUnits(supplySpeed, rdUnderlyingDecimals ?? 18)

//         return rdContract._setCompSupplySpeed( marketAddress, supplySpeedBN )
// }

// export const getSpeed = (
//         rdAddress: string,
//         marketAddress: string,
//         provider: Web3Provider | JsonRpcProvider,
//         type: string
// ) => {
//         const rdInterface = new Interface([
//                 'function compSupplySpeeds(address) public returns (uint256)',
//                 'function compBorrowSpeeds(address) public returns (uint256)'
//         ])

//         const rdContract = new Contract(
//                 rdAddress,
//                 rdInterface,
//                 provider
//         )

//         return type === 'supply' 
//         ? rdContract.callStatic.compSupplySpeeds( marketAddress )
//         : rdContract.callStatic.compBorrowSpeeds( marketAddress )
// }

// export const getPriceFromOracle = (
//         tokenAddress: string,
//         oracleAddress: string,
//         provider: Web3Provider | JsonRpcProvider,
// ) => {
//         console.log(tokenAddress)
//         // We need to call the MPO to get price of the given asset.
//         const oracleInterface = new Interface([
//                 'function price(address underlying) external view returns (uint)'
//         ])
    
//         const oracleContract = new Contract(
//                 oracleAddress,
//                 oracleInterface,
//                 provider
//         )
    
//         return oracleContract.callStatic.price(tokenAddress)    
// }

// export const extraPoolInfo = async (
//         comptrollerAddress: string,
//         provider: any
//     ) => {
//         const comptrollerInterface = new Interface([
//             'function oracle() returns (address)',
//             'function admin() returns (address)',
    
//         ])
    
//         const comptrollerContract = new Contract(
//             comptrollerAddress,
//             comptrollerInterface,
//             provider
//         )
    
//         let oracle: string = await comptrollerContract.callStatic.oracle();
//         const admin = await comptrollerContract.callStatic.admin();
    
//         return { oracle, admin }
//     }

// export const constructMantissa = (
//         rewardSpeed: number,
//         rewardEthPrice: number,
//         underlyingTotalSupply: number,
//         underlyingEthPrice: number,
//         rewardDecimals: number = 18,
//         underlyingDecimals: number = 18
// ) => {
//         const newRewardETHPerBlock =
//                 rewardEthPrice * (rewardSpeed / 10 ** rewardDecimals);

//         const newUnderlyingTotalSupplyETH =
//                 underlyingEthPrice * (underlyingTotalSupply / 10 ** underlyingDecimals);

//         const newMantissa =
//                 (newRewardETHPerBlock * 1e18) / newUnderlyingTotalSupplyETH;

//         return newMantissa;
// };

// export const toInt = (input: BigNumber) => {
//         if (!input) return 0
//         return parseInt(input.toString())
//       }

// export const convertMantissaToAPY = (mantissa: any, dayRange: number = 35) => {
//   const parsedMantissa = toInt(mantissa)
//   return (Math.pow((parsedMantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
// };

// export const convertMantissaToAPR = (mantissa: any) => {
//   const parsedMantissa = toInt(mantissa)
//   return (parsedMantissa * 2372500) / 1e16;
// };
