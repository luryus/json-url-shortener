import * as http from 'http';
import { format, parse, Url } from 'url';
import { SiteReader } from './site-reader';

const SHORT_URL_PATH_REGEX = /^\/([-\w]+)\/?$/;

export class JsonUrlShortenerServer {

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
                logStr += ` Location: ${res.getHeader('Location')}`;
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
                const matches = url.pathname.match(SHORT_URL_PATH_REGEX);
                if (matches !== null && matches.length === 2) {
                    const path = matches[1];
                    if (this.siteReader.urlMap.hasOwnProperty(path)) {
                        const fullUrl = this.siteReader.urlMap[matches[1]];
                        if (fullUrl) {
                            this.redirectResponse(format(fullUrl), response);
                            return;
                        }
                    }
                }
            }
        }

        this.notFoundError(response);
    }

    private redirectResponse(url: string, response: http.ServerResponse) {
        response.setHeader('Location', url);
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
