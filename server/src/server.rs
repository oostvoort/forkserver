use std::env;
use std::str::FromStr;

use ethers::prelude::*;
use ethers_core::abi::{AbiEncode, Token};
use ethers_core::utils::Anvil;
use serde_json::json;
use tonic::{Request, Response, Status};

use crate::forkserver::fork_server::Fork;
use crate::forkserver::{
    BlockNumberRequest, BlockNumberResponse, FundTokenRequest, LoadStateRequest, MineRequest,
    ResetRequest, SaveStateRequest, SaveStateResponse, SetBalanceRequest, StandardResponse,
};
use crate::utils;

pub struct ForkServerService {
    // save instance here so we can drop it later
    provider: Provider<Http>,
    block_number: u64,
    json_rpc_url: String,
}

impl ForkServerService {
    pub async fn new() -> Self {
        let port: u16 = utils::get_env("FORK_PORT", "8545")
            .parse()
            .expect("Invalid FORK_PORT");
        let chain_id: u64 = utils::get_env("FORK_CHAIN_ID", "1337")
            .parse()
            .expect("Invalid CHAIN_ID");
        let mnemonic: String = utils::get_env(
            "FORK_MNEMONIC",
            "test test test test test test test test test test test junk",
        )
        .parse()
        .expect("Invalid MNEMONIC");
        let block_number: u64 = utils::get_env("FORK_BLOCK_NUMBER", "1")
            .parse()
            .expect("Invalid FORK_BLOCK_NUMBER");
        let json_rpc_url: String =
            utils::get_env("FORK_JSON_RPC_URL", "https://mainnet.infura.io/v3/")
                .parse()
                .expect("Invalid FORK_RPC_URL");

        let home = env::var("HOME").expect("Error reading HOME env");
        let args = vec!["--host", "0.0.0.0"];

        let anvil = Anvil::new()
            .args(args)
            .path(format!("{home}/.foundry/bin/anvil"))
            .port(port)
            .chain_id(chain_id)
            .mnemonic(mnemonic)
            .fork_block_number(block_number)
            .fork(json_rpc_url.clone())
            .spawn();

        // TODO: autodeploy script here

        let anvil_endpoint = anvil.endpoint();
        println!("Anvil instance running on 0.0.0.0:8545");
        let provider =
            Provider::<Http>::try_from(anvil_endpoint).expect("Unable to get anvil provider");

        ForkServerService {
            provider,
            json_rpc_url,
            block_number,
        }
    }
}

#[tonic::async_trait]
impl Fork for ForkServerService {
    async fn block_number(
        &self,
        _request: Request<BlockNumberRequest>,
    ) -> Result<Response<BlockNumberResponse>, Status> {
        let block_number: U256 = self
            .provider
            .request("eth_blockNumber", ())
            .await
            .expect("Failed setting balance");
        let block_number = block_number.to_string();

        println!("block_number {block_number}");

        Ok(Response::new(BlockNumberResponse { block_number }))
    }
    async fn set_balance(
        &self,
        request: Request<SetBalanceRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        let request = request.into_inner();
        let account = request.address;
        println!("Setting balance of {account} to max");

        let _: () = self
            .provider
            .request(
                "anvil_setBalance",
                [account, "0x1000000000000000000".to_string()],
            )
            .await
            .expect("Failed setting balance");

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn mine(
        &self,
        request: Request<MineRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        let request = request.into_inner();
        let blocks = request.blocks;
        println!("Mining {blocks} blocks");

        let _: () = self
            .provider
            .request("anvil_mine", [blocks])
            .await
            .expect("Failed mining block");

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn reset(
        &self,
        _request: Request<ResetRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        println!("Resetting fork");

        let _: () = self.provider.request("anvil_reset", [
            json!({"forking":{"jsonRpcUrl": &self.json_rpc_url, "blockNumber": &self.block_number}})
        ]).await.expect("Failed resetting fork");

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn save_state(
        &self,
        _request: Request<SaveStateRequest>,
    ) -> Result<Response<SaveStateResponse>, Status> {
        println!("Saving state");

        let state: String = self
            .provider
            .request("anvil_dumpState", ())
            .await
            .expect("Failed saving state");

        Ok(Response::new(SaveStateResponse { state }))
    }

    async fn load_state(
        &self,
        request: Request<LoadStateRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        println!("Loading state");
        let state = request.into_inner().state;

        let _: bool = self
            .provider
            .request("anvil_loadState", [state])
            .await
            .expect("Failed loading state");

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn fund_token(
        &self,
        request: Request<FundTokenRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        let request = request.into_inner();
        let token_address = request.token_address;
        let account_address = request.account_address;
        let slot = request.slot;
        let amount = U256::from_str(request.amount.as_str())
            .expect("Error parsing amount")
            .encode_hex();

        let account256 =
            Token::Uint(U256::from_str(account_address.as_str()).expect("Error parsing account"));
        let slot256 = Token::Uint(U256::from(slot));
        let index = abi::encode(&[account256, slot256]);
        let slot = ethers::core::utils::keccak256(index).encode_hex();

        let _: bool = self
            .provider
            .request("anvil_setStorageAt", [token_address, slot, amount])
            .await
            .expect("Failed funding token");

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }
}
