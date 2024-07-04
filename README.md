# portlandbikepolo.com

## Deployment

Github Actions deploys the static site to [Github Pages](https://docs.github.com/en/pages)

## Local Development

[Vite](https://vitejs.dev/guide/) is used as a local testing webserver and asset builder.

**Requirements**

- npm (`10.8.1` or higher)

Highly recommended to run on WSL or in a Linux environment. Not tested on Windows.

```shell
❯ make
portlandbikepolo.com

Targets:
  dev: start development environment
  clean: clean up build and development files
```
