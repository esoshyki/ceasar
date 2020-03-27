const { program } = require('commander');
const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs');
const clc = require('cli-color')
const readline = require('readline');
const errors = require('./errors')

program
  .option('-s, --shift <value>', 'shifting')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-a, --actioncod <actioncod>', 'action')
  .parse(process.argv);

const shiftKey = program.shift ? parseInt(program.shift) : 0
const input = program.input;
let encoding;
if (!program.actioncod) {
  errors.NO_ACTION()
  process.exit(127)
}
if (program.actioncod === 'encode') {
  encoding = true
} else if (program.actioncod === 'decode') {
  encoding = false
} else {
  errors.WRONG_ACTION()
  process.exit(127)
}

let output = program.output ? program.output : null;

const transform = () => {

  const coder = (chunk) => {

    const str = chunk.toString('utf8')

    const decodeSmall = (char) => String.fromCharCode(97 + (26 + (char.charCodeAt(0) - shiftKey - 97 ))%26)
    const decodeBig = (char) => String.fromCharCode(65 +(26 + (char.charCodeAt(0) - shiftKey - 65)) % 26);

    const encdodeSmall = char => String.fromCharCode(((char.charCodeAt(0) + shiftKey - 97) % 26) + 97)
    const encodeBig = char => String.fromCharCode(((char.charCodeAt(0) + shiftKey - 65) % 26) + 65)
    
    let result = '';
  
    for (let char of str) {

      if (char.search(/[a-z]/) >= 0) {
        result += decodeSmall(char)
      } else if (char.search(/[A-Z]/) >= 0) {
        result += bigTransform(char)
      } else if (char.search(/.,!?"'%d+ / >= 0)) {
        result += char
      }
    }
    return result
  }

  const transformFunc = (chunk, encoding, callback) => {
    const str = chunk.toString('utf8').trim();
    const data = coder(str)
    callback(null, data)
  }

  return new stream.Transform({
    transform: transformFunc
  })
}

const readStdinStream = process.stdin;
readStdinStream.setEncoding('utf8');
readStdinStream
  .on('data', (chunk) => {
    if (chunk.split('').pop() == '\n') {
      readStdinStream.pause()
    }
  })
  .on('pause', function (err) {
    if (output) console.log(clc.yellow(clc.green(`Done. Written to ${output}`)));
  });

  function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
  
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
  }



async function run() {
  if (!output) {
    output = await askQuestion(clc.cyan('Enter ouput\n'))
  }
  const readStream =  input ? fs.createReadStream(input) : readStdinStream;
  const writeStream = fs.createWriteStream(output)

  writeStream.on('end', () => {
    console.log('ended')
  })

  if (!input) {
    console.log(clc.green('enter input data'))
  }

  await pipeline(
    readStream,
    transform(),
    writeStream,
  )
}

run()
  .then(_ => {
    console.log(clc.green(`Done. Written to ${output}`))
    process.exit(0)
  })
  .catch((err) => {
  console.log(err.message)
});