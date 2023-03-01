#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use ethers::contract::Contract;
    use ethers::core::k256::elliptic_curve::consts::U160;
    use ethers::prelude::{abigen, Address, Http, Middleware, Provider, U256};
    use ethers::providers::ProviderExt;
    use ethers_core::abi;
    use ethers_core::abi::{Abi, AbiEncode, Token};
    use ethers_core::types::Chain;

    #[tokio::test]
    async fn it_works() {
        let provider = Provider::<Http>::try_from("http://localhost:8545".to_string()).unwrap();

        dbg!(&provider);

        let chain_id = provider
            .get_chainid()
            .await
            .expect("Error fetching chain id");

        println!("{chain_id}");
        dbg!(&provider);

        // let result: String  = provider.request("eth_chainId", ()).await.expect("Failed funding token");
        // dbg!(result);
    }
}
