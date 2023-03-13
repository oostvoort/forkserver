init: docker proto-gen

proto-gen:
	cd dashboard && yarn && mkdir -p src/protobuf && yarn generate_proto && cd ..

docker:
	docker compose up -d

docker-build-server:
	docker build --progress=plain --rm --tag=oostvoort/forkserver:rust -f ./server/Dockerfile .

docker-build-dashboard:
	docker build --progress=plain --rm --tag=oostvoort/forkserver_dashboard:rust -f ./dashboard/Dockerfile .
