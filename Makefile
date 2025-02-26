.PHONY: install fresh db build clean run dev

install:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements.txt
	$(MAKE) db
	npm install

fresh: clean db

db:
	.venv/bin/python scripts/init_db.py

build:
	npm run build

clean:
	@ read -p "Are you sure? (y/n) " ans; \
	if [ "$$ans" != "y" ]; then \
		echo "Operation aborted."; \
		exit 1;\
	fi; \
	rm -rf instance/

run:
	.venv/bin/python app.py

dev:
	npm run dev &
	.venv/bin/flask run --debug
