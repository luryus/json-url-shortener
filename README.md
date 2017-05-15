json-url-shorter
================
Json-url-shorter is a simple url shorter written in TypeScript and node, which
reads the short urls from a json file.

Usage
-----
Build the typescript files:
```
npm build
```
Then run the app:
```
npm start -p 4455 urls.json
```

The url json file has the following format:
```json
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
docker build -t json-url-shorter:latest 
docker run -p 80:4455 $(pwd)/sites.json:/usr/share/app-config/sites.json json-url-shorter
```
