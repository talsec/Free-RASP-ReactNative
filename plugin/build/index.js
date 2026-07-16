"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
const FREERASP_SPM_EMBED_TAG = '# @generated freerasp-react-native (SPM embed)';
/**
 * Force dynamically linked frameworks — required by `spm_dependency`.
 */
const withFreeraspIosDynamicFrameworks = (config) => {
    return (0, config_plugins_1.withPodfileProperties)(config, (config) => {
        config.modResults['ios.useFrameworks'] = 'dynamic';
        return config;
    });
};
/**
 * Inject the TalsecRuntime embed step into the generated Podfile `post_install`,
 * so the SPM binary framework ends up in the app bundle (otherwise dyld fails at launch).
 */
const withFreeraspIosSpmEmbed = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        (config) => {
            const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
            let contents = fs.readFileSync(podfilePath, 'utf-8');
            if (!contents.includes(FREERASP_SPM_EMBED_TAG)) {
                const anchor = 'post_install do |installer|';
                const anchorIndex = contents.indexOf(anchor);
                if (anchorIndex === -1) {
                    config_plugins_1.WarningAggregator.addWarningIOS('freerasp-react-native', 'Could not find a `post_install` block in the Podfile to inject the ' +
                        'TalsecRuntime SPM embed step.');
                }
                else {
                    const snippet = [
                        '',
                        `    ${FREERASP_SPM_EMBED_TAG}`,
                        "    require Pod::Executable.execute_command('node', ['-p',",
                        `      'require.resolve("freerasp-react-native/freerasp_spm.rb", {paths: [process.argv[1]]})',`,
                        '      __dir__]).strip',
                        '    freerasp_embed_talsec_spm!(installer)',
                    ].join('\n');
                    const insertAt = anchorIndex + anchor.length;
                    contents =
                        contents.slice(0, insertAt) + snippet + contents.slice(insertAt);
                    fs.writeFileSync(podfilePath, contents);
                }
            }
            return config;
        },
    ]);
};
const withRnTalsecIos = (config) => {
    config = withFreeraspIosDynamicFrameworks(config);
    config = withFreeraspIosSpmEmbed(config);
    return config;
};
const withRnTalsecApp = (config, props) => {
    config = withBuildscriptDependency(config);
    config = withAndroidMinSdkVersion(config, props);
    config = withAndroidR8Version(config, props);
    config = withRnTalsecIos(config);
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
