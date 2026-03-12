.PHONY: build test lint clean demo install

build:
	npm run build

test:
	npm test

test:watch:
	npm run test:watch

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf dist coverage node_modules/.cache

demo: build
	@echo "Running demo..."
	@node dist/cli.js load --input samples/envs/dev.env

demo-diff: build
	@node dist/cli.js diff --envs samples/envs/dev.env,samples/envs/prod.env

demo-merge: build
	@node dist/cli.js merge --base samples/envs/dev.env --overlays samples/envs/staging.env

demo-encrypt: build
	@node dist/cli.js genkey --output samples/key.txt
	@node dist/cli.js encrypt --input samples/envs/dev.env --output samples/dev.enc --key-file samples/key.txt

demo-decrypt: build
	@node dist/cli.js decrypt --input samples/dev.enc --output samples/dev.dec --key-file samples/key.txt

install:
	npm install
