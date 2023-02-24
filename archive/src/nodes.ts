import {ForkedNode} from "./ForkedNode";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
})

let {INFURA_API_KEY, QUICKNODE_PROVIDER} = process.env;
if (!INFURA_API_KEY) throw new Error('INFURA_API_KEY is required!')
if (!QUICKNODE_PROVIDER) throw new Error('QUICKNODE_PROVIDER is required!')

export const nodes: Record<string, ForkedNode> = {
  mainnet: new ForkedNode(
    "mainnet",
    "https://mainnet.infura.io/v3/" + INFURA_API_KEY,
    8545
  ),
  bsc: new ForkedNode(
    "bsc",
    QUICKNODE_PROVIDER + "",
    10056,
  ),
  polygon: new ForkedNode(
    "polygon",
    "https://polygon-mainnet.infura.io/v3/" + INFURA_API_KEY,
    10137,
  ),
}
