import {
  AndroidConfig,
  ConfigPlugin,
  WarningAggregator,
  createRunOncePlugin,
  withProjectBuildGradle,
} from '@expo/config-plugins';
import { type ExpoConfig } from '@expo/config-types';
import { type PluginConfigType } from './pluginConfig';

const { createBuildGradlePropsConfigPlugin } = AndroidConfig.BuildProperties;

const urlFreerasp =
  'https://europe-west3-maven.pkg.dev/talsec-artifact-repository/freerasp';
const urlJitpack = 'https://www.jitpack.io';

const setBuildscriptDependency = (buildGradle: string) => {
  // This enables users in bare workflow to comment out the line to prevent freerasp from adding it back.

  const mavenFreerasp = buildGradle.includes(urlFreerasp)
    ? ''
    : `maven { url "${urlFreerasp}" }`;
  const mavenJitpack = buildGradle.includes(urlJitpack)
    ? ''
    : `maven { url "${urlJitpack}" }`;

  // It's ok to have multiple allprojects.repositories, so we create a new one since it's cheaper than tokenizing
  // the existing block to find the correct place to insert our dependency.
  const combinedGradleMaven = `
    allprojects {
      repositories {
        ${mavenFreerasp}
        ${mavenJitpack}
      }
    }
  `;

  return buildGradle + `\n${combinedGradleMaven}\n`;
};

const setAndroidR8 = (buildGradle: string, version: string) => {
  const combinedGradleMaven = `
    buildscript {
      dependencies {
          classpath("com.android.tools:r8:${version}")
      }
    }
  `;

  return buildGradle + `\n${combinedGradleMaven}\n`;
};

/**
 * Update `<project>/build.gradle` by adding nexus dependency to buildscript
 */
const withBuildscriptDependency: ConfigPlugin = (expoConfig) => {
  return withProjectBuildGradle(expoConfig, (config) => {
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

const withAndroidMinSdkVersion =
  createBuildGradlePropsConfigPlugin<PluginConfigType>(
    [
      {
        propName: 'android.minSdkVersion',
        propValueGetter: (config) => config.android?.minSdkVersion?.toString(),
      },
    ],
    'withAndroidMinSdkVersion'
  );

/**
 * Update `<project>/build.gradle` by updating the R8 version
 */
const withAndroidR8Version: ConfigPlugin<PluginConfigType> = (
  expoConfig: ExpoConfig,
  props: PluginConfigType
) => {
  if (!props.android?.R8Version) {
    return expoConfig;
  }
  return withProjectBuildGradle(expoConfig, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = setAndroidR8(
        config.modResults.contents,
        props.android?.R8Version ?? '+'
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

const withRnTalsecApp: ConfigPlugin<PluginConfigType> = (config, props) => {
  config = withBuildscriptDependency(config);
  config = withAndroidMinSdkVersion(config, props);
  config = withAndroidR8Version(config, props);
  return config;
};

let pkg: { name: string; version?: string } = {
  name: 'freerasp-react-native',
};
try {
  const freeraspPkg = require('freerasp-react-native/package.json');
  pkg = freeraspPkg;
} catch {}

export default createRunOncePlugin(withRnTalsecApp, pkg.name, pkg.version);
