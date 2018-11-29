const fs = require('fs');
const binanceJson = require('./binance-orders.json');
const bittrexJson = require('./bittrex-orders.json');


function sortJSON(input, output, write = true) {
  const data = input.reduce((next, value) => {
    const keys = Object.keys(next);
    const baseExchange = value.exchange.replace('-', '');
    const exchange = baseExchange.includes('BTC')
      ? `${baseExchange.replace('BTC', '')}|BTC`
      : baseExchange.includes('ETH')
        ? `${baseExchange.replace('ETH', '')}|ETH`
        : `${baseExchange.replace('USDT', '')}|USDT`
    return {
      ...next,
      [exchange]: keys.includes(exchange)
        ? [...next[exchange], value]
        : [value]
    }
  }, {});

  if (write) fs.writeFileSync(`./data/${output}.json`, JSON.stringify(data, null, 2))
  else return data
}

function mergeFiles(base, nextFile, write = true) {
  const baseKeys = Object.keys(base)
  const data = Object.keys(nextFile).reduce((next, key) => {
    if (baseKeys.includes(key)) {
      return {
        ...next,
        [key]: [...base[key], ...nextFile[key]]
      }
    } else {
      return {
        ...next,
        [key]: nextFile[key]
      }
    }
  }, base)


  if (write) fs.writeFileSync(`./data/orders.json`, JSON.stringify(data, null, 2));
  fs.writeFileSync('./data/pairs.json', JSON.stringify(Object.keys(data).sort(), null, 2));
}

const files = [
  { input: bittrexJson, output: 'bittrex' },
  { input: binanceJson, output: 'binance' }
]

files.forEach(({ input, output }) => sortJSON(input, output))

mergeFiles(sortJSON(files[0].input, files[0].output, false), sortJSON(files[1].input, files[1].output, false))