init: init-env docker proto-gen

init-env:
	cp .env.example .env

proto-gen:
	cd dashboard && yarn && mkdir -p src/protobuf && yarn generate_proto && cd ..

docker:
	docker compose up -d

