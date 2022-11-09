import Web3 from 'web3'

class UtilWeb3 {
  static createWeb3(rpc) {
    const web3 = new Web3()
    web3.setProvider(new Web3.providers.HttpProvider(rpc))
    return web3
  }

  static getBalanceOf(address, contractAddress, web3) {
    return new Promise(function (resolve, reject) {
      try {
        const ABI = [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address'
              }
            ],
            name: 'balanceOf',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
              }
            ],
            stateMutability: 'view',
            type: 'function'
          }
        ]
        const contract = new web3.eth.Contract(ABI, contractAddress)
        contract.methods.balanceOf(address).call((err, result) => {
          if (err) {
            console.log('balanceOf========================')
            console.log({ err })
            console.log('====================================')
            resolve(-1)
          }
          resolve(result)
        })
      } catch (error) {
        console.log('balanceOf========================')
        console.log({ error })
        console.log('====================================')
        resolve(-1)
      }
    })
  }

  static getPoolID(address, index, contractAddress, web3) {
    return new Promise(function (resolve, reject) {
      try {
        const ABI = [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256'
              }
            ],
            name: 'tokenOfOwnerByIndex',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
              }
            ],
            stateMutability: 'view',
            type: 'function'
          }
        ]
        const contract = new web3.eth.Contract(ABI, contractAddress)
        contract.methods
          .tokenOfOwnerByIndex(address, index)
          .call((err, result) => {
            if (err) {
              console.log('tokenOfOwnerByIndex========================')
              console.log({ err })
              console.log('====================================')
              resolve(-1)
            }
            resolve(result)
          })
      } catch (error) {
        console.log(
          'error function tokenOfOwnerByIndex========================'
        )
        console.log({ error })
        console.log('====================================')
        resolve(-1)
      }
    })
  }
}
export default UtilWeb3
