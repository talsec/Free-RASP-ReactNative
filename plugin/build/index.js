"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const { createBuildGradlePropsConfigPlugin } = config_plugins_1.AndroidConfig.BuildProperties;
const urlFreerasp = 'https://europe-west3-maven.pkg.dev/talsec-artifact-repository/freerasp';
const urlJitpack = 'https://www.jitpack.io';
const setBuildscriptDependency = (buildGradle) => {
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
const setAndroidR8 = (buildGradle, version) => {
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
const withBuildscriptDependency = (expoConfig) => {
    return (0, config_plugins_1.withProjectBuildGradle)(expoConfig, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setBuildscriptDependency(config.modResults.contents);
        }
        else {
            config_plugins_1.WarningAggregator.addWarningAndroid('freerasp-react-native', `Cannot automatically configure project build.gradle, because it's not groovy`);
        }
        return config;
    });
};
const withAndroidMinSdkVersion = createBuildGradlePropsConfigPlugin([
    {
        propName: 'android.minSdkVersion',
        propValueGetter: (config) => config.android?.minSdkVersion?.toString(),
    },
], 'withAndroidMinSdkVersion');
/**
 * Update `<project>/build.gradle` by updating the R8 version
 */
const withAndroidR8Version = (expoConfig, props) => {
    if (!props.android?.R8Version) {
        return expoConfig;
    }
    return (0, config_plugins_1.withProjectBuildGradle)(expoConfig, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setAndroidR8(config.modResults.contents, props.android?.R8Version ?? '+');
        }
        else {
            config_plugins_1.WarningAggregator.addWarningAndroid('freerasp-react-native', `Cannot automatically configure project build.gradle, because it's not groovy`);
        }
        return config;
    });
};
const withRnTalsecApp = (config, props) => {
    config = withBuildscriptDependency(config);
    config = withAndroidMinSdkVersion(config, props);
    config = withAndroidR8Version(config, props);
    return config;
};
let pkg = {
    name: 'freerasp-react-native',
};
try {
    const freeraspPkg = require('freerasp-react-native/package.json');
    pkg = freeraspPkg;
}
catch { }
exports.default = (0, config_plugins_1.createRunOncePlugin)(withRnTalsecApp, pkg.name, pkg.version);
