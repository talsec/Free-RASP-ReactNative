import {
  AndroidConfig,
  ConfigPlugin,
  WarningAggregator,
  createRunOncePlugin,
  withProjectBuildGradle,
} from '@expo/config-plugins';

import { PluginConfigType } from './pluginConfig';

const { createBuildGradlePropsConfigPlugin } = AndroidConfig.BuildProperties;

const urlNexus =
  'https://nexus3-public.monetplus.cz/repository/ahead-talsec-free-rasp';
const urlJitpack = 'https://www.jitpack.io';

export const setBuildscriptDependency = (buildGradle: string) => {
  // This enables users in bare workflow to comment out the line to prevent freerasp from adding it back.

  const mavenNexus = buildGradle.includes(urlNexus)
    ? ''
    : `maven { url "${urlNexus}" }`;
  const mavenJitpack = buildGradle.includes(urlNexus)
    ? ''
    : `maven { url "${urlJitpack}" }`;

  // It's ok to have multiple allprojects.repositories, so we create a new one since it's cheaper than tokenizing
  // the existing block to find the correct place to insert our dependency.
  const combinedGradleMaven = `
    allprojects {
      repositories {
        ${mavenNexus}
        ${mavenJitpack}
      }
    }
  `;

  return buildGradle + `\n${combinedGradleMaven}\n`;
};

/**
 * Update `<project>/build.gradle` by adding nexus dependency to buildscript
 */
export const withBuildscriptDependency: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = setBuildscriptDependency(
        config.modResults.contents
      );
    } else {
      WarningAggregator.addWarningAndroid(
        'freerasp-react-native',
        `Cannot automatically configure project build.gradle, because it's not groovy`
      );
    }
    return config;
  });
};

export const withAndroidMinSdkVersion =
  createBuildGradlePropsConfigPlugin<PluginConfigType>(
    [
      {
        propName: 'android.minSdkVersion',
        propValueGetter: (config) => config.android?.minSdkVersion?.toString(),
      },
    ],
    'withAndroidMinSdkVersion'
  );

const withRnTalsecApp: ConfigPlugin<PluginConfigType> = (config, props) => {
  config = withBuildscriptDependency(config);
  config = withAndroidMinSdkVersion(config, props);
  return config;
};

const pkg = require('freerasp-react-native/package.json');

export default createRunOncePlugin(withRnTalsecApp, pkg.name, pkg.version);
