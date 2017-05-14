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
```
{
  "short_path": "http://full.url.com/hello",
  ...
}
```
Changes to the site json file are automatically reloaded.
