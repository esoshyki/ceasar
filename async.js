const { program } = require('commander');
const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs');
const clc = require('cli-color')
const readline = require('readline');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

program
  .option('-s, --shift <value>', 'shifting')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-a, --action <action>', 'action')
  .parse(process.argv);

const shiftKey = program.shiftKey ? parseInt(program.shiftKey) : 0
const input = program.input;
let output = program.output ? program.output : null;

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

const transform = () => {
  const transformFunc = (chunk, encoding, callback) => {
    const str = chunk.toString('utf8');
    const data = str.split('').reverse().join('')
    callback(null, data)
  }

  return new stream.Transform({
    transform: transformFunc
  })
}

const readStdinStream = process.stdin;
readStdinStream.setEncoding('utf8');
readStdinStream
  .on('data', function (chunk) {
    readStdinStream.destroy();
  })
  .on('close', function (err) {
    console.log(clc.yellow(`Done. Written to ${output}`));
  });


async function run() {
  if (!output) {
    output = await askQuestion(clc.cyan('Enter ouput\n'))
  }
  const readStream =  input ? fs.createReadStream(input) : readStdinStream;
  const writeStream = fs.createWriteStream(output, {autoClose: true})

  if (!input) {
    console.log(clc.green('enter input data'))
  }

  await pipeline(
    readStream,
    transform(),
    writeStream,
  );
  console.log(clc.green('Pipeline succeeded.'));
  process.exit(0)
}

run().catch((err) => {

});