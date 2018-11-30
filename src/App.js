import React, { Component } from 'react'
import orders from './orders';

class App extends Component {
  renderCoin(coin, key) {
    const quantity = coin.reduce((next, row) => next + ((row.type.match(/sell/i) ? -1 : 1) * row.quantity), 0)
    const total = coin.reduce((next, row) => next + ((row.type.match(/sell/i) ? -1 : 1) * row.total), 0)
    return quantity <= 1 ? null : (
      <fieldset key={key}>
        <legend>{key}</legend>
        <div>
          <b>{total}</b>
          <b>{quantity}</b>
        </div>
      </fieldset>
    )
  }

  render() {
    return (
      <main>
        <div className="container">
          {Object.keys(orders).map(key => this.renderCoin(orders[key], key))}
        </div>
      </main>
    )
  }
}

export default App