import * as commander from 'commander';
import * as fs from 'fs-extra';
import * as http from 'http';
import { format, parse, Url} from 'url';

import { JsonUrlShorterServer } from './json-url-shorter-server';
import { SiteReader } from './site-reader';

(async function main(): Promise<void> {
    commander.version('0.1.0')
        .usage('[options] <json file>')
        .option('-p, --port <port>', 'HTTP port', parseInt, 4455)
        .parse(process.argv);

    if (commander.args.length !== 1) {
        commander.help();
    }

    const filename = commander.args[0];
    const inputFileStat = await fs.stat(filename);

    if (!inputFileStat.isFile()) {
        console.error('Input file not valid');
        process.exit(1);
    }

    const port = parseInt(commander.opts().port, 10);

    console.log(`Starting server with json file ${filename} on 0.0.0.0:${port}`);
    const shorter = new JsonUrlShorterServer(filename, port);
    shorter.start();
})();
