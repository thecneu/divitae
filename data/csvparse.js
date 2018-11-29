const Papa = require('papaparse');
const fs = require('fs');

function convertToJSON(input, output) {
  console.log(`Converting ${input} to ${output}`);

  Papa.parse(fs.createReadStream(`${__dirname}/${input}`), {
    header: true,
    complete: (results) => {
      const data = results.data.map(row => ({
        exchange: row.Exchange || row.Market,
        type: row.Type,
        quantity: row.Quantity || row.Amount,
        price: row.Limit || row.Price,
        total: row.Total || row.Price,
        closed: row.Closed || row['Date(UTC)']
      }));

      fs.writeFileSync(`${__dirname}/${output}`, JSON.stringify(data, null, 2))
    }
  });
}


const files = [
  { input: 'bittrex-orders.csv', output: 'bittrex-orders.json' },
  { input: 'binance-orders.csv', output: 'binance-orders.json' }
]

files.forEach(({ input, output }) => convertToJSON(input, output))