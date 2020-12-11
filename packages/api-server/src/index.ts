#!/usr/bin/env node
import path from 'path'

import requireDir from 'require-dir'
import yargs from 'yargs'

import { server, setLambdaFunctions } from './http'
import { requestHandler } from './requestHandlers/awsLambda'

const { port, functions } = yargs
  .option('port', { default: 8911, type: 'number' })
  .option('functions', {
    alias: 'f',
    required: true,
    type: 'string',
    desc: 'The path where your Serverless Functions are stored',
  }).argv

if (process.env.NODE_ENV !== 'production') {
  console.info(`NODE_ENV ${process.env.NODE_ENV}`)
  // Transpile files during development,
  // this command has to be run from the "api" directory.
  const babelRequireHook = require('@babel/register')
  babelRequireHook({
    extends: path.join(process.cwd(), '.babelrc.js'),
    extensions: ['.js', '.ts'],
    only: [process.cwd()],
    ignore: ['node_modules'],
    cache: false,
  })
}

const serverlessFunctions = requireDir(path.join(process.cwd(), functions), {
  recurse: false,
  extensions: ['.js', '.ts'],
})

try {
  server({ requestHandler }).listen(port, () => {
    console.log(`http://localhost:${port}`)
    setLambdaFunctions(serverlessFunctions)
  })
} catch (e) {
  console.error(e)
  process.exit(1)
}
