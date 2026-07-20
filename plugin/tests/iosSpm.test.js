/* eslint-env node */

const assert = require('assert').strict;
const mutatePodfileForFreeraspSpm = require('../build/iosSpm').default;
const configureIosSpmProperties = require('../build/iosSpmProperties').default;

const FREERASP_SPM_ACTIVATION_TAG =
  '# @generated freerasp-react-native (SPM activation)';
const FREERASP_SPM_DISABLED_TAG =
  '# @generated freerasp-react-native (SPM disabled)';
const FREERASP_SPM_EMBED_TAG = '# @generated freerasp-react-native (SPM embed)';

const podfile = `prepare_react_native_project!

target 'Example' do
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => nested_option(enabled: false),
      :quoted_value => "parentheses do not count: ())"
    )
  end
end
`;

const mutation = mutatePodfileForFreeraspSpm(podfile);
assert.equal(mutation.changed, true);
assert.deepEqual(mutation.missingAnchors, []);

const activationIndex = mutation.contents.indexOf(FREERASP_SPM_ACTIVATION_TAG);
const targetIndex = mutation.contents.indexOf("target 'Example'");
assert(
  activationIndex > mutation.contents.indexOf('prepare_react_native_project!')
);
assert(activationIndex < targetIndex);

const postInstallCloseIndex = mutation.contents.indexOf('\n    )');
const embedIndex = mutation.contents.indexOf(FREERASP_SPM_EMBED_TAG);
const postInstallEndIndex = mutation.contents.indexOf('\n  end', embedIndex);
assert(embedIndex > postInstallCloseIndex);
assert(embedIndex < postInstallEndIndex);

const secondMutation = mutatePodfileForFreeraspSpm(mutation.contents);
assert.equal(secondMutation.changed, false);
assert.equal(secondMutation.contents, mutation.contents);

const disabledMutation = mutatePodfileForFreeraspSpm(mutation.contents, false);
assert.equal(disabledMutation.changed, true);
assert(disabledMutation.contents.includes(FREERASP_SPM_DISABLED_TAG));
assert(disabledMutation.contents.includes("ENV['FREERASP_DISABLE_SPM'] = '1'"));
assert.equal(
  disabledMutation.contents.includes(FREERASP_SPM_ACTIVATION_TAG),
  false
);
assert.equal(disabledMutation.contents.includes(FREERASP_SPM_EMBED_TAG), false);

const secondDisabledMutation = mutatePodfileForFreeraspSpm(
  disabledMutation.contents,
  false
);
assert.equal(secondDisabledMutation.changed, false);
assert.equal(secondDisabledMutation.contents, disabledMutation.contents);

const reenabledMutation = mutatePodfileForFreeraspSpm(
  disabledMutation.contents,
  true
);
assert.equal(reenabledMutation.changed, true);
assert(reenabledMutation.contents.includes(FREERASP_SPM_ACTIVATION_TAG));
assert(reenabledMutation.contents.includes(FREERASP_SPM_EMBED_TAG));
assert.equal(
  reenabledMutation.contents.includes(FREERASP_SPM_DISABLED_TAG),
  false
);

const missingAnchors = mutatePodfileForFreeraspSpm(
  'target "Example" do\nend\n'
);
assert.equal(missingAnchors.changed, false);
assert.equal(missingAnchors.contents, 'target "Example" do\nend\n');
assert.deepEqual(missingAnchors.missingAnchors, [
  'prepare_react_native_project!',
  'react_native_post_install(',
]);

const windowsMutation = mutatePodfileForFreeraspSpm(
  podfile.replace(/\n/g, '\r\n')
);
assert.equal(windowsMutation.changed, true);
assert.equal(
  windowsMutation.contents.replace(/\r\n/g, '').includes('\n'),
  false
);

const propertiesWithoutFrameworks = {};
configureIosSpmProperties(propertiesWithoutFrameworks, true);
assert.equal(propertiesWithoutFrameworks['ios.useFrameworks'], 'dynamic');
configureIosSpmProperties(propertiesWithoutFrameworks, false);
assert.deepEqual(propertiesWithoutFrameworks, {});

const propertiesWithStaticFrameworks = {
  'ios.useFrameworks': 'static',
};
configureIosSpmProperties(propertiesWithStaticFrameworks, true);
configureIosSpmProperties(propertiesWithStaticFrameworks, true);
assert.equal(propertiesWithStaticFrameworks['ios.useFrameworks'], 'dynamic');
configureIosSpmProperties(propertiesWithStaticFrameworks, false);
assert.deepEqual(propertiesWithStaticFrameworks, {
  'ios.useFrameworks': 'static',
});

const unownedProperties = {
  'ios.useFrameworks': 'dynamic',
};
configureIosSpmProperties(unownedProperties, false);
assert.deepEqual(unownedProperties, {
  'ios.useFrameworks': 'dynamic',
});

console.log('Expo iOS SPM tests passed.');
