use std::env;
use std::str::FromStr;

use ethers::prelude::*;
use ethers_core::abi::{AbiEncode, Token};
use ethers_core::utils::{Anvil, AnvilInstance};
use serde_json::json;
use tonic::{Request, Response, Status};

use crate::forkserver::{
    BlockNumberRequest, BlockNumberResponse, FundTokenRequest, IncreaseTimeRequest,
    LoadStateRequest, MineRequest, ResetRequest, SaveStateRequest, SaveStateResponse,
    SetBalanceRequest, StandardResponse,
};
use crate::forkserver::fork_server::Fork;
use crate::utils;

pub struct ForkServerService {
    _anvil_instance: AnvilInstance,
    provider: Provider<Http>,
    block_number: u64,
    json_rpc_url: String,
}

impl ForkServerService {
    pub async fn new() -> Self {
        // No error handling here, better to let it crash on startup
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
        let block_time: u64 =
            utils::get_env("FORK_BLOCK_TIME", "13")
                .parse()
                .expect("Invalid FORK_BLOCK_TIME");
        let home = env::var("HOME").expect("Error reading HOME env");
        let home = format!("{home}/.foundry/bin/anvil");
        let args = vec!["--host", "0.0.0.0"];

        let mut anvil: Anvil = Anvil::new()
            .args(args)
            .path(home)
            .port(port)
            .chain_id(chain_id)
            .mnemonic(mnemonic)
            .fork(json_rpc_url.clone());

        if block_time > 0 {
            anvil = anvil.block_time(block_time);
        } else {
            println!("✅ Auto mining enabled");
        }

        if block_number > 0 {
            anvil = anvil.fork_block_number(block_number);
        } else {
            println!("✅ Starting on latest block");
        }

        let _anvil_instance: AnvilInstance = anvil.spawn();

        let anvil_endpoint = _anvil_instance.endpoint();
        println!("✅ Anvil instance running on 0.0.0.0:8545");

        let provider =
            Provider::<Http>::try_from(anvil_endpoint).expect("Unable to get anvil provider");

        println!("👌 Forkserver is ready");
        ForkServerService {
            _anvil_instance,
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
        let block_number: U256 = match self.provider.request("eth_blockNumber", ()).await {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("block_number: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

        let block_number = block_number.to_string();

        Ok(Response::new(BlockNumberResponse { block_number }))
    }
    async fn set_balance(
        &self,
        request: Request<SetBalanceRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        let request = request.into_inner();
        let account = request.address;
        println!("set_balance: {account}");

        let _: () = match self
            .provider
            .request(
                "anvil_setBalance",
                [account, "0x1000000000000000000".to_string()],
            )
            .await
        {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("set_balance: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

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
        println!("mine: {blocks} blocks");

        let _: () = match self.provider.request("anvil_mine", [blocks]).await {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("mine: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn reset(
        &self,
        _request: Request<ResetRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        println!("reset");

        let reset_params = json!({"forking":{"jsonRpcUrl": &self.json_rpc_url, "blockNumber": &self.block_number}});

        let _: () = match self.provider.request("anvil_reset", [reset_params]).await {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("reset: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn save_state(
        &self,
        _request: Request<SaveStateRequest>,
    ) -> Result<Response<SaveStateResponse>, Status> {
        println!("save_state");

        let state: String = match self.provider.request("anvil_dumpState", ()).await {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("save_state: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

        Ok(Response::new(SaveStateResponse { state }))
    }

    async fn load_state(
        &self,
        request: Request<LoadStateRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        let state = request.into_inner().state;
        println!("load_state");

        let _: bool = match self.provider.request("anvil_loadState", [state]).await {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("load_state: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

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

        println!("fund_token: account {account_address}, token: {token_address}");

        let amount = match U256::from_str(request.amount.as_str()) {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("fund_token: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        }
            .encode_hex();

        // Should .as_str() be checked for errors?
        let account256 = Token::Uint(
            U256::from_str(account_address.as_str()).expect("Error parsing account to str"),
        );
        let slot256 = Token::Uint(U256::from(slot));
        let index = abi::encode(&[account256, slot256]);
        let slot = ethers::core::utils::keccak256(index).encode_hex();

        let _: bool = match self
            .provider
            .request("anvil_setStorageAt", [token_address, slot, amount])
            .await
        {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("fund_token: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }

    async fn increase_time(
        &self,
        request: Request<IncreaseTimeRequest>,
    ) -> Result<Response<StandardResponse>, Status> {
        let request: IncreaseTimeRequest = request.into_inner();
        let seconds: i32 = request.seconds;
        println!("increase_time: {seconds} seconds");

        let _: i32 = match self.provider.request("evm_increaseTime", [seconds]).await {
            Ok(res) => res,
            Err(e) => {
                let error_message = format!("increase_time: ERROR {e}");
                eprintln!("{error_message}");
                return Err(Status::internal(error_message));
            }
        };

        Ok(Response::new(StandardResponse {
            status: "Ok 👌".to_string(),
        }))
    }
}
