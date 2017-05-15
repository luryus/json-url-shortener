json-url-shortener
================
Json-url-shortener is a simple url shortener written in TypeScript and node. It reads the urls from a json file.

Usage
-----
Build the typescript files:
```sh
npm build
```
Then run the app:
```sh
npm start -p 4455 urls.json
```

The url json file has the following format:
```
{
  "short_path": "http://full.url.com/hello",
  ...
}
```
Changes to the site json file are automatically reloaded.

Running with Docker
-------------------
The project includes a simple Dockerfile for running the app in a container.
Start the server in a docker container with:
```sh
docker build -t json-url-shortener:latest 
docker run -p 80:4455 $(pwd)/sites.json:/usr/share/app-config/sites.json json-url-shortener
```
