#[cfg(test)]
mod tests {
    use ethers::core::k256::elliptic_curve::bigint::U64;
    use ethers::prelude::{Http, Provider};
    use serde::{Deserialize, Serialize};

    #[tokio::test]
    async fn it_works() {
        let provider = Provider::<Http>::try_from("http://localhost:8545".to_string()).unwrap();

        #[derive(Debug, Default, Clone, PartialEq, Eq, Deserialize, Serialize)]
        pub struct TxpoolStatus {
            pending: String,
            queued: String,
        }

        let tx_pool_status: TxpoolStatus = provider
            .request("txpool_status", ())
            .await
            .expect("Failed fetching txpool_status");

        dbg!(tx_pool_status);


        // #[derive(Debug, Default, Clone, PartialEq, Eq, Deserialize, Serialize)]
        // pub struct TxPoolContent {
        //     pending: BTreeMap<Address, BTreeMap<String, Transaction>>,
        //     queued: BTreeMap<Address, BTreeMap<String, Transaction>>,
        // }
        //
        // let tx_pool_status: TxPoolContent = provider
        //     .request("txpool_content", ())
        //     .await
        //     .expect("Failed fetching txpool_status");
        //
        // dbg!(tx_pool_status);
    }
}
