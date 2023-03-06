use std::env;
use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());

    tonic_build::configure()
        .protoc_arg("--experimental_allow_proto3_optional")
        .build_server(true)
        .out_dir("src/protobuf/")
        .compile_well_known_types(true)
        .file_descriptor_set_path(out_dir.join("fork_descriptor.bin"))
        .compile(&["../proto/Forkserver.proto"], &["../proto/"])?;
    Ok(())
}
