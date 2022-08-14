name_image = stepsize-pr-api
name_container = stepsize-pr-api
network = stepsize-network
tag = 1.0.0
# build and execute container to develop in local
local:
	docker build -f Dockerfile -t ${name_image}:${tag} .
	-docker rm ${name_container}
	docker run -d --name ${name_container} --restart=unless-stopped \
		-p 3000:3000 \
		--network=${network} \
		${name_image}:${tag}
