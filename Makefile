
SHELL = /bin/bash
.SHELLFLAGS = -o pipefail -c

.PHONY: help
help: ## Print info about all commands
	@echo "✨ Commands:"
	@echo
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[01;32m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Run the development servers
	$(MAKE) backend_env
	$(MAKE) db
	$(MAKE) frontend_env
	npm run dev &
	.venv/bin/flask --app 'technote/server.py' run --debug

.PHONY: test
test: ## Run all tests
	$(MAKE) backend_env
	.venv/bin/pytest -v

.PHONY: db
db: ## Ensure the database is ready
	@if [ ! -d "technote/instance/*.db" ]; then \
		$(MAKE) backend_env; \
		.venv/bin/python scripts/init_db.py; \
	fi

.PHONY: db
fresh_instance: ## Remove the "instance/" directory, create a new database
	@rm -rf technote/instance/
	@echo "🧹 The instance cleaned up!"
	$(MAKE) backend_env
	@.venv/bin/python scripts/init_db.py
	@echo "🗄️ A new database created!"

.PHONY: run
run: ## Run without installation
	$(MAKE) backend_env
	$(MAKE) db
	$(MAKE) build_web
	.venv/bin/python -m technote

.PHONY: install
install: ## Install as a package
	$(MAKE) db
	$(MAKE) build_web
	pipx install . --force
	@echo "🥰 Successfully installed!"
	@printf "🚀 Use the \033[01;32m%s\033[0m command to run the app.\n" technote

.PHONY: package
package: ## Create package
	$(MAKE) backend_env
	$(MAKE) fresh_instance
	$(MAKE) build_web
	.venv/bin/python -m build
	@echo "📦 Successfully built the package!"

.PHONY: install_package
install_package: ## Install and run the created package to test it
	@pipx install dist/*.whl --force
	@technote

.PHONY: upload
upload: ## Upload the created package to PyPI
	$(MAKE) backend_env
	@.venv/bin/twine upload dist/*
	@echo "🚀 Successfully uploaded!"

.PHONY: build_web
build_web: ## Build the web client
	$(MAKE) frontend_env
	npm run build

.PHONY: backend_env
backend_env: ## Install Python packages
	@if [ ! -d ".venv" ]; then \
		python3 -m venv .venv; \
		.venv/bin/pip install -r requirements.txt; \
	fi

.PHONY: frontend_env
frontend_env: ## Install node modules
	@if [ ! -d "node_modules" ]; then \
		npm install; \
	fi

.PHONY: clean
clean: ## Remove build files, database
	@ read -p "Confirm clean? (y/N) " ans; \
	if [ "$$ans" != "y" ]; then \
		echo "Operation aborted."; \
		exit 1; \
	fi
	@rm -rf \
		technote/instance/ \
		technote/static/dist/ \
		build/ \
		*.egg-info/ \
		dist/
	@echo "🧹 Cleaned up!"

.PHONY: deep_clean
deep_clean: ## Remove packages, cache files
	@ $(MAKE) clean && \
	rm -rf \
		.venv/ \
		node_modules/ \
		technote/__pycache__/ \
		tests/__pycache__/ \
		.pytest_cache/
	@echo "🧹 The environment is clean."
