import { SupportedChainId } from './chain'
import { Token, CurrencyAmount } from '@uniswap/sdk-core'
export const DAI = new Token(
  SupportedChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDT = new Token(
  SupportedChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)
export const USDC_MAINNET = new Token(
  SupportedChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const WETH9 = {}

export const WRAPPED_NATIVE_CURRENCY = {
  ...WETH9,
  [SupportedChainId.OPTIMISM]: new Token(
    SupportedChainId.OPTIMISM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.OPTIMISM_GOERLI]: new Token(
    SupportedChainId.OPTIMISM_GOERLI,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_ONE]: new Token(
    SupportedChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_RINKEBY]: new Token(
    SupportedChainId.ARBITRUM_RINKEBY,
    '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.POLYGON]: new Token(
    SupportedChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),
  [SupportedChainId.CELO]: new Token(
    SupportedChainId.CELO,
    '0x471ece3750da237f93b8e339c536989b8978a438',
    18,
    'CELO',
    'Celo native asset'
  ),
  [SupportedChainId.CELO_ALFAJORES]: new Token(
    SupportedChainId.CELO_ALFAJORES,
    '0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9',
    18,
    'CELO',
    'Celo native asset'
  )
}

export const tokens = {
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': 'DAI',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 'ETH'
}
export const USDC_ROPSTEN = new Token(
  SupportedChainId.ROPSTEN,
  '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  6,
  'USDC',
  'USD//C'
)
export const USDC_RINKEBY = new Token(
  SupportedChainId.RINKEBY,
  '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  6,
  'tUSDC',
  'test USD//C'
)
export const USDC_GOERLI = new Token(
  SupportedChainId.GOERLI,
  '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  6,
  'USDC',
  'USD//C'
)
export const USDC_KOVAN = new Token(
  SupportedChainId.KOVAN,
  '0x31eeb2d0f9b6fd8642914ab10f4dd473677d80df',
  6,
  'USDC',
  'USD//C'
)
export const USDC_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  6,
  'USDC',
  'USD//C'
)
export const USDC_OPTIMISM_GOERLI = new Token(
  SupportedChainId.OPTIMISM_GOERLI,
  '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ARBITRUM = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ARBITRUM_RINKEBY = new Token(
  SupportedChainId.ARBITRUM_RINKEBY,
  '0x09b98f8b2395d076514037ff7d39a091a536206c',
  6,
  'USDC',
  'USD//C'
)
export const USDC_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  6,
  'USDC',
  'USD//C'
)
export const USDC_POLYGON_MUMBAI = new Token(
  SupportedChainId.POLYGON_MUMBAI,
  '0xe11a86849d99f524cac3e7a0ec1241828e332c62',
  6,
  'USDC',
  'USD//C'
)

export const WBTC = new Token(
  SupportedChainId.MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const DAI_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai stable coin'
)
export const CUSD_CELO = new Token(
  SupportedChainId.CELO,
  '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  18,
  'cUSD',
  'Celo Dollar'
)
export const STABLECOIN_AMOUNT_OUT = {
  [SupportedChainId.MAINNET]: CurrencyAmount.fromRawAmount(
    USDC_MAINNET,
    100000000000
  ),
  [SupportedChainId.ARBITRUM_ONE]: CurrencyAmount.fromRawAmount(
    USDC_ARBITRUM,
    100000000000
  ),
  [SupportedChainId.OPTIMISM]: CurrencyAmount.fromRawAmount(
    DAI_OPTIMISM,
    100000000000000000000000
  ),
  [SupportedChainId.POLYGON]: CurrencyAmount.fromRawAmount(
    USDC_POLYGON,
    100000000000
  ),
  [SupportedChainId.CELO]: CurrencyAmount.fromRawAmount(
    CUSD_CELO,
    100000000000000000000000
  )
}
