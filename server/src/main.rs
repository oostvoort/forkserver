use std::net::SocketAddr;

use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{Any, CorsLayer};

use crate::forkserver::fork_server::ForkServer;
use crate::server::ForkServerService;

mod model;
mod server;

pub mod utils {
    include!("../src/utils.rs");
}

pub mod forkserver {
    include!("protobuf/forkserver.rs");

    pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
        tonic::include_file_descriptor_set!("fork_descriptor");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::from_filename(".env").expect(".env file not found");

    let server_port = utils::get_env("SERVER_PORT", "3000");
    let addr: SocketAddr = format!("0.0.0.0:{server_port}").parse()?;
    println!("Forkserver listening on {}", addr);

    let cors = CorsLayer::new()
        .allow_headers(Any)
        .allow_methods(Any)
        .allow_origin(Any);

    let service = ForkServer::new(ForkServerService::new().await);

    let reflection_service = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(forkserver::FILE_DESCRIPTOR_SET)
        .build()
        .unwrap();

    Server::builder()
        .layer(cors)
        .layer(GrpcWebLayer::new())
        .accept_http1(true)
        .add_service(service)
        .add_service(reflection_service)
        .serve(addr)
        .await?;

    Ok(())
}
