import * as fs from 'fs-extra';
import * as url from 'url';

const SHORT_URL_REGEX = /^[-\w]+$/;

export interface SiteUrlMap {
    [short: string]: url.Url;
}

export class SiteReader {

    private _urlMap: SiteUrlMap;

    constructor(private readonly filename: string) {
        this.readUrlsFromJson();
        fs.watch(filename, (e, fn) => {
            if (e === 'change') {
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
            if (urlJsonMap.hasOwnProperty(short)) {
                if (!SHORT_URL_REGEX.test(short)) {
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

        console.log('Using short urls:');
        console.log(Object.keys(this._urlMap)
            .map((key: string) => `${key}: ${this._urlMap[key].href}`));
    }
}
