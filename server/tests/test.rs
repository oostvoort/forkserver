#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use ethers::contract::Contract;
    use ethers::core::k256::elliptic_curve::consts::U160;
    use ethers::prelude::{abigen, Address, Http, Provider, U256};
    use ethers_core::abi;
    use ethers_core::abi::{Abi, AbiEncode, Token};

    #[tokio::test]
    async fn it_works() {
        let provider = Provider::<Http>::try_from("http://localhost:8545".to_string()).unwrap();
        let token_address: String = "0xdac17f958d2ee523a2206206994597c13d831ec7".to_string();
        let account_address: String = "0x7D4969385A37738CeFCC91FC9A82911AC1909d58".to_string();
        let amount = U256::from_str("100000000000000").expect("Error parsing amount").encode_hex();

        let abi: Abi = serde_json::from_str(r#"[{ "type": "function", "name": "manipulateBalance", "inputs": [ { "name": "account", "type": "uint256" }, { "name": "slot", "type": "uint256" } ], "outputs": [ { "name": "arg", "type": "u64" } ], "stateMutability": "view" }]"#).unwrap();
        let contract_address = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee".parse::<Address>().unwrap();
        let contract = Contract::new(contract_address, abi, provider.clone());
        let account256 = U256::from_str(account_address.as_str()).expect("Error parsing account");
        let slot256 = U256::from(2);
        let index = contract.encode("manipulateBalance", (account256, slot256)).unwrap();
        let slot = ethers::core::utils::keccak256(index).encode_hex();

        dbg!(&token_address);
        dbg!(&slot);
        dbg!(&amount);

        // let address256 = Token::Uint(U256::from_str(account_address.as_str()).expect("Error parsing account"));
        // let slot256 = Token::Uint(U256::from(2));
        // let index = abi::encode(&[address256, slot256]);

        let result: bool  = provider.request("anvil_setStorageAt", [
            token_address,
            slot,
            amount
        ]).await.expect("Failed funding token");

        dbg!(result);
    }
}
