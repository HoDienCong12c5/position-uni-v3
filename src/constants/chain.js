const INFURA_KEY = '4bf032f2d38a4ed6bb975b80d6340847'

export const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const POOL_INIT_CODE_HASH =
  '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
// celo v3 addresses
const CELO_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES =
  '0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A'
const CELO_TICK_LENS_ADDRESSES = '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D'
const CELO_V3_CORE_FACTORY_ADDRESSES =
  '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc'
const CELO_ROUTER_ADDRESS = '0x5615CDAb10dc425a742d643d949a7F474C01abc4'
const CELO_V3_MIGRATOR_ADDRESSES = '0x3cFd4d48EDfDCC53D3f173F596f621064614C582'
const CELO_MULTICALL_ADDRESS = '0x633987602DE5C4F337e3DbF265303A1080324204'
const CELO_QUOTER_ADDRESSES = '0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8'

export const SupportedChainId = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,

  ARBITRUM_ONE: 42161,
  ARBITRUM_RINKEBY: 421611,

  OPTIMISM: 10,
  OPTIMISM_GOERLI: 420,

  POLYGON: 137,
  POLYGON_MUMBAI: 80001,

  CELO: 42220,
  CELO_ALFAJORES: 44787
}
const DEFAULT_NETWORKS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN
]
export function constructSameAddressMap(address, additionalNetworks = []) {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES = {
  ...constructSameAddressMap('0xC36442b4a4522E871399CD717aBDD847Ab11FE88', [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISM_GOERLI,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON
  ]),
  [SupportedChainId.CELO]: CELO_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  [SupportedChainId.CELO_ALFAJORES]: CELO_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES
}
export const CHAIN_NETWORK_WITH_CHAIN_NAME = {
  ethereum: 1,
  bnb: 56,
  optimism: 10,
  polygon: 137,
  optimism_goerli: 420,
  celo: 4222,
  celo_alfajores: 44787,
  arbitrum: 42161
}
export const V3_CORE_FACTORY_ADDRESSES = {
  ...constructSameAddressMap('0x1F98431c8aD98523631AE4a59f267346ea31F984', [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISM_GOERLI,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON
  ]),
  [SupportedChainId.CELO]: CELO_V3_CORE_FACTORY_ADDRESSES,
  [SupportedChainId.CELO_ALFAJORES]: CELO_V3_CORE_FACTORY_ADDRESSES
}
