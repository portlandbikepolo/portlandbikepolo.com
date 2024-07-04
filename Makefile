.PHONY: help
help:
	@echo "portlandbikepolo.com"
	@echo
	@echo "Targets:"
	@echo "  dev: start development environment"
	@echo "  clean: clean up build and development files"

.PHONY: dev
dev:
	@npm run dev

.PHONY: clean
clean:
	@rm -rf node_modules
	@rm -rf ./src/dist
