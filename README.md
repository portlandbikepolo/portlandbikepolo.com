# portlandbikepolo.com

## Deployment

Github Actions deploys the static site to [Github Pages](https://docs.github.com/en/pages)

## Local Development

Highly recommended to run on WSL or in a Linux environment. Not tested on Windows.

```shell
❯ make
portlandbikepolo.com

Targets:
  dev: start development environment
  clean: clean up build and development files
```

### Requirements

- npm (`10.8.1` or higher)

### Local Testing

[Vite](https://vitejs.dev/guide/) is used as a local testing webserver and asset builder.

Run

```shell
make dev
```

npm should install all test dependencies and launch vite.

You should see the following in your terminal

```
 VITE v5.2.11  ready in 263 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
