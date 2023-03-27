FROM rust:1.67

WORKDIR /opt
COPY server server
COPY proto proto

# Install Protocol Buffers Compiler
RUN apt-get update -y && \
    apt install -y protobuf-compiler libprotobuf-dev

# Build server binary
WORKDIR /opt/server
RUN cargo build --release

FROM rust:1.67

# Install foundry
RUN curl -L https://foundry.paradigm.xyz | bash
RUN /bin/bash -c "/root/.foundry/bin/foundryup"

# Copy binary from first build
COPY --from=0 /opt/server/target/release/server ./

#CMD cargo run --release --bin server
CMD ./server

# Server
EXPOSE 3000

# Fork (Anvil)
EXPOSE 8545
