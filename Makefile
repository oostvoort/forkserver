init: docker proto-gen

proto-gen:
	cd dashboard && yarn && mkdir -p src/protobuf && yarn generate_proto && cd ..

docker:
	docker compose up -d

docker-build-server:
	docker build --progress=plain --rm --tag=oostvoort/anvil_forkserver:latest -f ./server/Dockerfile .

docker-build-dashboard:
	docker build --progress=plain --rm --tag=oostvoort/anvil_forkserver_dashboard:latest -f ./dashboard/Dockerfile .

docker-build-caddy:
	docker build --progress=plain --rm --tag=oostvoort/anvil_forkserver_caddy:latest -f ./deploy/Caddy.Dockerfile .

docker-push-dashboard:
	docker push oostvoort/anvil_forkserver_dashboard:latest

docker-push-server:
	docker push oostvoort/anvil_forkserver:latest

docker-push-caddy:
	docker push oostvoort/anvil_forkserver_caddy:latest

docker-build-push-all: docker-build-server docker-build-dashboard docker-build-caddy docker-push-dashboard docker-push-server docker-push-caddy

docker-build-push-dashboard: docker-build-dashboard docker-push-dashboard
