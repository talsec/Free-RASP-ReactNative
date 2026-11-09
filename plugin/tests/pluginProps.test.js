/* eslint-env node */

const assert = require('assert').strict;
const withRnTalsecApp = require('../build').default;

const expoConfig = () => ({ name: 'example', slug: 'example' });

assert.doesNotThrow(() => withRnTalsecApp(expoConfig()));
assert.doesNotThrow(() => withRnTalsecApp(expoConfig(), undefined));
assert.doesNotThrow(() => withRnTalsecApp(expoConfig(), {}));
assert.doesNotThrow(() =>
  withRnTalsecApp(expoConfig(), { android: { minSdkVersion: 26 } })
);

console.log('pluginProps tests passed');
