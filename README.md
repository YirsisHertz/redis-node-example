# Example Node.js and Redis 7

## Get Docker image

```#bash
$ docker pull redis:7.2-rc2-alpine
```

## Create Redis container using Docker

```#bash
$ docker run --name=redis -p 6379:6379 -d redis:7.2-rc2-alpine
```
