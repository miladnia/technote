# Makefile

.PHONY: install fresh db clean run dev

install:
	pip3 install -r requirements.txt
	$(MAKE) db

fresh: clean db

db:
	python3 scripts/init_db.py

clean:
	@ read -p "Are you sure? (y/n) " ans; \
	if [ "$$ans" != "y" ]; then \
		echo "Operation aborted."; \
		exit 1;\
	fi; \
	rm -rf instance/

run:
	python3 app.py

dev:
	flask run --debug
