init: docker proto-gen

proto-gen:
	cd dashboard && yarn && mkdir -p src/protobuf && yarn generate_proto && cd ..

docker:
	docker compose up -d

docker-build-server:
	docker build --progress=plain --rm --tag=oostvoort/anvil_forkserver:latest -f ./server/Dockerfile .

docker-build-dashboard:
	docker build --progress=plain --rm --tag=oostvoort/anvil_forkserver_dashboard:latest -f ./dashboard/Dockerfile .

docker-push-dashboard:
	docker push oostvoort/anvil_forkserver_dashboard:latest

docker-push-server:
	docker push oostvoort/anvil_forkserver:latest


