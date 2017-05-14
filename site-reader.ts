import * as fs from 'fs-extra';
import * as url from 'url';

const ShortUrlRegex = /^[-\w]+$/;

export interface SiteUrlMap {
    [short: string]: url.Url;
}

export class SiteReader {

    private _urlMap: SiteUrlMap;

    constructor(private readonly filename: string) {
        this.readUrlsFromJson();
        fs.watch(filename, (event, filename) => {
            if (event === 'change') {
                this.readUrlsFromJson();
            }
        });
    }

    get urlMap(): SiteUrlMap {
        return this._urlMap;
    }

    private async readUrlsFromJson() {
        const urlJsonMap: { [s: string]: string } = await fs.readJson(this.filename);
        this._urlMap = {};
        for (const short in urlJsonMap) {
            if (!ShortUrlRegex.test(short)) {
                console.error(`Invalid short url "${short}"`);
                continue;
            }

            try {
                const fullUrl = url.parse(urlJsonMap[short]);
                this._urlMap[short] = fullUrl;
            } catch (e) {
                if (e instanceof TypeError) {
                    console.error(`Invalid url for short "${short}: ${urlJsonMap[short]}"`, e);
                } else {
                    throw e;
                }
            }
        }
    }
}
