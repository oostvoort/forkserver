import dotenv from "dotenv"
import path from "path"
import createDebug from "debug"
import express from "express"
import cors from "cors"
import websocketStream from "websocket-stream"
import expressWs from "express-ws"
import hre from "hardhat"
import fsExtra from "fs-extra"
import "hardhat-forktools/dist/type-extensions"
import "hardhat-change-network/dist/src/type-extensions"
import {nodes} from "./nodes";

const debug = createDebug("FORK")
debug(path.resolve(process.cwd(), ".env"))

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
})

let {NETWORK, SERVER_PORT} = process.env;
if (!NETWORK || !SERVER_PORT) throw new Error('Missing ENV variables!')

if (!SERVER_PORT) {
  console.warn('SERVER_PORT not set, defaulting to 3000')
  SERVER_PORT = '3000'
}

const app = express()
app.use(express.static("web", {index: "index.html"}))

// extend express app with app.ws()
expressWs(app, undefined, {
  wsOptions: {
    perMessageDeflate: false,
  },
})

app.use(
  cors({
    origin: "*",
  }),
)

// app is already extended with ws but ts is still throwing ws does not exist on app error
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.ws(
  "/logs/:alias",
  function (
    ws: string | WebSocket,
    req: { params: { alias: string | number } },
  ) {
    const runningNode = nodes[req.params.alias]
    const stream = websocketStream(ws)

    if (runningNode?.proc?.stdout) {
      runningNode.proc.stdout.pipe(stream)
    }
  },
)

app.get("/start/:network", async (req, res) => {
  debug("starting")
  const runningNode = nodes[req.params.network]
  try {
    runningNode.start()
    debug("done starting")
  } catch (e) {
    console.log(e)
  }
  return res.status(200).send({result: "started"})
})

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/web/index.html"))
})

app.get("/fork/setbalance/:network", async (req, res) => {
  debug("/fork/setbalance/:network")

  hre.changeNetwork(`localhost_fork_${req.params.network}`)

  debug(req.query)
  try {
    await hre.forktools.setBalance(req.query.address, "0x1000000000000000000")
    return res.status(200).send({result: "setbalance"})
  } catch (e: any) {
    return res.status(500).send({result: e.message})
  }
})

app.get("/fork/reset/:network", async (req, res) => {
  debug("/fork/reset/:network")

  hre.changeNetwork(`localhost_fork_${req.params.network}`)

  try {
    await hre.forktools.fork_reset(nodes[req.params.network].url)

    return res.status(200).send({result: "hardhat_reset"})
  } catch (e: any) {
    return res.status(500).send({result: e.message})
  }

  // return res.status(200).send({ result: "reset" })
})

app.get("/logme", (req, res) => {
  debug("yes")
  return res.status(200).send("yes")
})

app.get("/deployed/:network", (req, res) => {
  const network = req.params.network
  let deployed = fsExtra.readJsonSync(
    path.resolve(
      process.cwd(),
      "hardhat/mainnet/glue/mainnet/deployed.json",
    ),
  )

  // if (network === "mainnet") {
  //   deployed = _.omit(deployed, ["settings"])
  // }
  if (!deployed) res.status(200).send(`No contracts found for ${network}`)
  else return res.status(200).send(deployed)
})

app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204)
})

process.on("SIGINT", function () {
  if (nodes?.mainnet?.proc?.pid !== undefined) {
    process.kill(-nodes.mainnet.proc.pid)
  }
  if (nodes?.bsc?.proc?.pid !== undefined) {
    process.kill(-nodes.bsc.proc.pid)
  }
  if (nodes?.polygon?.proc?.pid !== undefined) {
    process.kill(-nodes.polygon.proc.pid)
  }

  process.exit()
})

app.listen(parseInt(SERVER_PORT), () => {
  debug(`Using ${NETWORK.toUpperCase()} network`)
  debug(`Server started`)

  nodes[NETWORK].start()
})
