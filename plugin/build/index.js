"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = require("fs");
const path_1 = require("path");
const iosSpm_1 = __importDefault(require("./iosSpm"));
const iosSpmProperties_1 = __importDefault(require("./iosSpmProperties"));
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
// iOS — SPM delivery of TalsecRuntime (default on RN >= 0.75). Sets dynamic frameworks
// and injects a guarded TalsecRuntime embed into the Podfile post_install (skipped on the
// vendored fallback / FREERASP_DISABLE_SPM=1). Note: the Expo prebuild flow is less
// battle-tested than bare React Native.
/**
 * Configure dynamic frameworks while SPM is active and remove only values
 * previously managed by this plugin when switching back to the vendored path.
 */
const withFreeraspIosFrameworks = (config, spmEnabled) => {
    return (0, config_plugins_1.withPodfileProperties)(config, (cfg) => {
        (0, iosSpmProperties_1.default)(cfg.modResults, spmEnabled);
        return cfg;
    });
};
/**
 * Inject the TalsecRuntime embed step into the generated Podfile `post_install`,
 * so the SPM binary framework ends up in the app bundle (otherwise dyld fails at launch).
 */
const withFreeraspIosPodfile = (config, props) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        (cfg) => {
            const podfilePath = (0, path_1.join)(cfg.modRequest.platformProjectRoot, 'Podfile');
            const contents = (0, fs_1.readFileSync)(podfilePath, 'utf-8');
            const result = (0, iosSpm_1.default)(contents, props?.spmEnabled ?? true);
            if (result.missingAnchors.length > 0) {
                config_plugins_1.WarningAggregator.addWarningIOS('freerasp-react-native', 'Could not configure TalsecRuntime delivery because the Podfile is missing: ' +
                    result.missingAnchors.join(', '));
            }
            else if (result.changed) {
                (0, fs_1.writeFileSync)(podfilePath, result.contents);
            }
            return cfg;
        },
    ]);
};
const withRnTalsecIos = (config, props) => {
    const spmEnabled = props?.ios?.useSpm !== false && process.env.FREERASP_DISABLE_SPM !== '1';
    config = withFreeraspIosFrameworks(config, spmEnabled);
    config = withFreeraspIosPodfile(config, { spmEnabled });
    return config;
};
const withRnTalsecApp = (config, props) => {
    config = withBuildscriptDependency(config);
    config = withAndroidMinSdkVersion(config, props);
    config = withAndroidR8Version(config, props);
    config = withRnTalsecIos(config, props);
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
