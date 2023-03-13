use std::net::SocketAddr;

use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{Any, CorsLayer};

use crate::forkserver::fork_server::ForkServer;
use crate::server::ForkServerService;

mod server;

pub mod utils {
    include!("../src/utils.rs");
}

pub mod forkserver {
    include!("protobuf/forkserver.rs");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::from_filename(".env").unwrap_or_default();

    let server_port = utils::get_env("SERVER_PORT", "3000");
    let address: SocketAddr = format!("0.0.0.0:{server_port}").parse()?;
    println!("✅ Forkserver listening on {}", address);

    let cors = CorsLayer::new()
        .allow_headers(Any)
        .allow_methods(Any)
        .allow_origin(Any);

    let service = ForkServer::new(ForkServerService::new().await);

    Server::builder()
        .layer(cors)
        .layer(GrpcWebLayer::new())
        .accept_http1(true)
        .add_service(service)
        .serve(address)
        .await?;

    Ok(())
}
