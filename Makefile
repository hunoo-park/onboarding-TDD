TAG := $$(git log -1 --pretty=format:%h)
IMAGE_NAME := node_app:${TAG}
ECS_URL := 497217256558.dkr.ecr.ap-northeast-1.amazonaws.com/onboarding_hw
ECS_TAG := ${ECS_URL}:${TAG}
ECS_LATEST := ${ECS_URL}:latest
build:
	@docker build . -t ${IMAGE_NAME}
	@docker tag ${IMAGE_NAME} ${ECS_TAG}
	@docker tag ${IMAGE_NAME} ${ECS_LATEST}

run:
	@docker run -p 3001:3001 ${IMAGE_NAME}

push:
	@aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 497217256558.dkr.ecr.ap-northeast-1.amazonaws.com
	@docker push ${ECS_LATEST}
	@docker push ${ECS_TAG}


delete:
	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep node_app | awk '{print ($$2":"$$3)}')
	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep none | awk '{print $$1}')
	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep onboarding_repository | awk '{print ($$2":"$$3)}')


