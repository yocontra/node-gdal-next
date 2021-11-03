const fs = require('fs')

const bench = fs.readdirSync(__dirname).filter((file) => file.match(/\.bench\.js$/));

(async () => {
  for (const b of bench) {
    console.log(`${b}`)
    // eslint-disable-next-line no-await-in-loop
    await require(`${__dirname}/${b}`)
    console.log(`\n\n`)
  }
})()
