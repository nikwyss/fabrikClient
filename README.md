# fabrikClient (fabrikclient)

A demokratiefabrik Vue-js Client installed and configured by Quasar-CLI

## Install the dependencies
```bash
yarn install
quasar upgrade
```

## Environment Variables
- Env variables in /.quasar.env.json (QENV module)

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn esling --fix
```


# DOCKER

## Builds
Autobuild is enabled. After each git/push a new docker build is generated.
For manually builds, you may enter:

> docker build -f Dockerfile -t demokratiefabrik/fabrikclient .
> docker push demokratiefabrik/fabrikclient:latest
(or push it via portainer)

## Runs
> docker run --publish 80:80 --detach --name fabrikClient demokratiefabrik/fabrikclient:latest


### Build the app for production
```bash
quasar build

```

# run
> docker run --publish 80:80 --detach --name fabrikClient demokratiefabrik/fabrikclient:latest
