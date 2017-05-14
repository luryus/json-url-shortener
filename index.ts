import * as http from 'http';
import * as fs from 'fs-extra';
import * as commander from 'commander';
import { Url, parse, format } from 'url';

import { SiteReader } from './site-reader';

export const ShortUrlPathRegex = /^\/([-\w]+)\/?$/;

class JsonUrlShorter {

    private readonly server: http.Server;
    private readonly siteReader: SiteReader;

    constructor(
        private readonly filename: string,
        private readonly port: number) {
        this.siteReader = new SiteReader(filename);
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
            let logStr = `${req.method} ${req.url} ${res.statusCode}`;
            if (res.statusCode === 301) {
                logStr += ` Location: ${res.getHeader("Location")}`;
            }
            console.log(logStr);
        });
    }

    public start() {
        this.server.listen(this.port);
    }

    private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        if (request.method !== 'GET') {
            this.methodNotAllowedError(response);
            return;
        }

        if (request.url !== undefined) {
            const url = parse(request.url);
            if (url.pathname) {
                const matches = url.pathname.match(ShortUrlPathRegex);
                if (matches != null && matches.length == 2) {
                    const fullUrl = this.siteReader.urlMap[matches[1]];
                    this.redirectResponse(format(fullUrl), response);
                    return;
                }
            }
        }

        this.notFoundError(response);
    }

    private redirectResponse(url: string, response: http.ServerResponse) {
        response.setHeader("Location", url);
        response.writeHead(301);
        response.end();
    }

    private notFoundError(response: http.ServerResponse) {
        response.writeHead(404);
        response.end('Not found');
    }

    private methodNotAllowedError(response: http.ServerResponse) {
        response.writeHead(405);
        response.end('Method not allowed');
    }
}

(async function main() : Promise<void> {
    commander.version('0.0.1')
        .usage('[options] <json file>')
        .option('-p, --port <port>', 'HTTP port', parseInt, 4455)
        .parse(process.argv);

    if (commander.args.length != 1) {
        commander.help();
    }

    const filename = commander.args[0];
    const inputFileStat = await fs.stat(filename);

    if (!inputFileStat.isFile()) {
        console.error("Input file not valid");
        process.exit(1);
    }

    const port = parseInt(commander.opts().port);

    console.log(`Starting server with json file ${filename} on 0.0.0.0:${port}`);
    const shorter = new JsonUrlShorter(filename, port);
    shorter.start();
})();
