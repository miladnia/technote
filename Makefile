# Makefile

.PHONY: all fresh db clean run dev

all:
	pip3 install -r requirements.txt
	$(MAKE) db

fresh: clean db

db:
	python3 init_db.py

clean:
	rm -ri .cache/
	rm -i notes.db

run:
	python3 app.py

dev:
	flask run --debug
