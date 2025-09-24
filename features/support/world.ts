import { chromium, firefox, webkit } from '@playwright/test';
import type { Browser, Page, BrowserType } from '@playwright/test';
import { setWorldConstructor, World } from '@cucumber/cucumber';

export class PlaywrightWorld extends World {
    public browser: Browser;
    public page: Page;
    public gamePage: any;
    public historyButtons: any[];
    public moveCount: number;

    constructor(options: any) {
        super(options);
        this.historyButtons = [];
        this.moveCount = 0;
    }

    async init() {
        const headless = this.parameters?.headless !== false;
        const browserType = process.env.BROWSER || 'chromium';

        let browserLauncher: BrowserType<any>;

        switch (browserType.toLowerCase()) {
            case 'firefox':
                browserLauncher = firefox;
                break;
            case 'webkit':
            case 'safari':
                browserLauncher = webkit;
                break;
            case 'edge':
                // Use chromium with Edge channel
                this.browser = await chromium.launch({
                    headless,
                    channel: 'msedge'
                });
                this.page = await this.browser.newPage();
                return;
            case 'chrome':
                // Use chromium with Chrome channel
                this.browser = await chromium.launch({
                    headless,
                    channel: 'chrome'
                });
                this.page = await this.browser.newPage();
                return;
            case 'chromium':
            default:
                browserLauncher = chromium;
                break;
        }

        this.browser = await browserLauncher.launch({ headless });
        this.page = await this.browser.newPage();
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

setWorldConstructor(PlaywrightWorld);
