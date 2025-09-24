import { Before, After } from '@cucumber/cucumber';
import { PlaywrightWorld } from './world.ts';

Before(async function (this: PlaywrightWorld) {
    await this.init();
});

After(async function (this: PlaywrightWorld) {
    await this.cleanup();
});
