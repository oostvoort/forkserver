import {ChildProcess, spawn} from "child_process";
import {StaticJsonRpcProvider} from "@ethersproject/providers";
import path from "path";
import createDebug from "debug";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
})

const debug = createDebug("ForkedNode")
debug(path.resolve(process.cwd(), ".env"))


let {HARDHAT_MAX_MEMORY} = process.env;
if (!HARDHAT_MAX_MEMORY) {
  console.warn('HARDHAT_MAX_MEMORY not set, defaulting to 2048')
  HARDHAT_MAX_MEMORY = '2048'
}

export class ForkedNode {
  network: string
  url: string
  port: number
  proc: ChildProcess | undefined
  provider: StaticJsonRpcProvider | undefined

  constructor(network: string, url: string, port: number) {
    this.network = network
    this.url = url
    this.port = port
  }

  start() {
    if (this.proc) {
      if (this.proc.pid) process.kill(-this.proc.pid)
      this.proc = undefined
    }

    const hardhatFolder = path.resolve(process.cwd(), "hardhat", this.network)

    this.proc = spawn(
      // prettier-ignore
      `network=${this.network} $(which node)  --max-old-space-size=${HARDHAT_MAX_MEMORY} ${process.cwd()}/node_modules/.bin/hardhat node --hostname 0.0.0.0 --fork ${this.url} --port ${this.port}`,
      {
        shell: true,
        detached: true,
        cwd: hardhatFolder,
      },
    )

    if (this.proc.stdout) {
      this.proc.stdout.on("data", data => {
        console.log(`${data}`)
      })
    }

    if (this.proc.stderr) {
      this.proc.stderr.on("data", data => {
        console.log(`${data}`)
      })
    }

    this.proc.on("close", (code, signal) => {
      console.log(`child process terminated due to receipt of signal ${signal}`)
    })

    this.proc.on("error", err => {
      console.log(`child process errored: ${err}`)
    })

    this.provider = new StaticJsonRpcProvider(`http://localhost:${this.port}`)
  }
}
