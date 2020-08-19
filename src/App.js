import React, { Component } from 'react'
import caver from './klaytn/caver'
import WalletInfo from './components/WalletInfo'
// import AddToken from './components/AddToken'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      balance: 0,
      network: null,
    }
  }

  componentDidMount() {
    this.setNetworkInfo()
  }

  loadAccountInfo = async () => {
    const { klaytn } = window

    if (klaytn) {
      try {
        await klaytn.enable()
        this.setAccountInfo(klaytn)
        klaytn.on('accountsChanged', () => this.setAccountInfo(klaytn))
      } catch (error) {
        console.log('User denied account access')
      }
    } else {
      console.log('Non-Kaikas browser detected. You should consider trying Kaikas!')
    }
  }

  setAccountInfo = async () => {
    const { klaytn } = window
    if (klaytn === undefined) return
    await new Promise((resolve, reject) => setTimeout(resolve, 500))
    const account = klaytn.selectedAddress
    const balance = await caver.klay.getBalance(account)
    this.setState({
      account,
      balance: caver.utils.fromPeb(balance, 'KLAY'),
    })
  }

  setNetworkInfo = () => {
    const { klaytn } = window
    if (klaytn === undefined) return

    this.setState({ network: klaytn.networkVersion })
    klaytn.on('networkChanged', () => this.setNetworkInfo(klaytn.networkVersion))
  }

  
  render() {
    const { account, balance } = this.state
    

    return (
      <div>
        <div>
          <WalletInfo address={account} balance={balance} />
          <button onClick={this.loadAccountInfo}>지갑 연동</button>
        </div>
        <div>
          <button>토큰 생성</button>
          <button>토큰 전송</button>
        </div>
      </div>  
    )
  }

}

export default App;
