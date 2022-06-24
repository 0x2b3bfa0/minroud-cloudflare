# Minroud[^1]
Simple serverless image hosting

## Deployment

```console
$ wrangler r2 bucket create minroud
$ wrangler publish
endpoint: minroud.{user}.workers.dev
```

## Usage

```console
$ curl {endpoint} --header "Content-Type: image/png" --data-binary @image.png
https://minroud.{user}.workers.dev/{hash}
```

[^1]: Named after [Yor's Minroud](https://en.wikipedia.org/wiki/List_of_The_Neverending_Story_characters#Yor) from [The Neverending Story](https://en.wikipedia.org/wiki/The_Neverending_Story).
