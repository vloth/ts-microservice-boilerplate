#!/usr/bin/env node
import { spawn } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'
import { GenericContainer } from 'testcontainers'

function run(command, env) {
  return new Promise(resolve => {
    const [cmd, ...args] = command
    const child = spawn(cmd, args, { env })

    child.stdout.on('data', chunk => process.stdout.write(chunk))
    child.stderr.on('data', chunk => process.stderr.write(chunk))

    child.on('close', code => {
      if (code !== 0) {
        const err = `  Child command ${command.join(' ')} exited with code ${code}`
        console.error(chalk.red(err))
      }
      resolve(code)
    })
  })
}

// As stopping container can take a while and this script
// can be interrupted at any time, we need to make sure
// we don't ask docker to stop the container while the stop process
// is already running
let containerStopInProgress = false
async function stopContainer(container) {
  if (container == null || containerStopInProgress) return
  containerStopInProgress = true
  const spinner = ora(chalk.blue('  Stopping Postgres')).start()
  await container.stop()
  spinner.stop()
  console.log(chalk.blue('  Postgres docker container stopped'))
}

async function killOnSignal(container) {
  process.on('SIGINT', async function() {
    console.log(chalk.yellow('  Caught interrupt signal'))
    await stopContainer(container)
    process.exit()
  })
}

async function startContainer() {
  const [user, password, db] = ['postgres', 'postgres', 'btc_wallet']

  const container = await new GenericContainer('postgres')
    .withExposedPorts(5432)
    .withEnvironment({ 
        POSTGRES_PASSWORD: password,
        POSTGRES_USER: user,
        POSTGRES_DB: db
    })
    .start()

  const host = container.getHost()
  const port = container.getMappedPort(5432)
  const connectionString = `postgresql://${user}:${password}@${host}:${port}/${db}`

  return { container, host, port, connectionString }
}

async function main() {
  const spinner = ora(chalk.blue('  Starting Postgres')).start()

  const { container, host, port, connectionString } = await startContainer()
  killOnSignal(container)

  spinner.stop()

  console.log(
    chalk.blue('  Postgres started, available at ') +
    chalk.blue.bold(`postgresql://${host}:${port}`)
  )


  const env = { ...process.env, db: connectionString }

  // remove first two arguments [node, path] from command arg
  const childCmd = process.argv.splice(2)
  const exitCode = await run(childCmd, env)

  await stopContainer(container)
  process.exit(exitCode)
}

main()

