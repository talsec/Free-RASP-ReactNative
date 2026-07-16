require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# ---------------------------------------------------------------------------
# Swift Package Manager (SPM) — PHASE 1 PRE-PREPARATION (non-breaking)
#
# TODO(SPM infra): the dedicated RN-flavour SPM manifest repo + GCP-hosted
# TalsecRuntime xcframework are NOT ready yet. The values below are PLACEHOLDERS.
# The opt-in SPM path (FREERASP_USE_SPM=1) is wired but NOT usable until the infra
# lands. The vendored xcframework remains the default and keeps working.
#
# IMPORTANT: this must point at the RN-flavour manifest repo — NOT talsec/Free-RASP-iOS
# (that is the *native* iOS flavour and is the wrong artifact for React Native).
#
# PHASE 2 FLIP (do this once the infra is ready — breaking, major version):
#   1. Set TALSEC_SPM_URL / TALSEC_SPM_MIN_VERSION to the real manifest repo + tag.
#   2. Remove the `use_spm` flag and the vendored branch below; call spm_dependency
#      unconditionally; `raise` if spm_dependency is unavailable (RN < 0.75).
#   3. `git rm ios/TalsecRuntime.xcframework` and drop its ref in the .xcodeproj.
#   4. example/ios/Podfile: embed unconditionally + dynamic frameworks.
#   5. Expo plugin: enable iOS SPM by default (see plugin/src/index.ts).
#   6. package.json: major bump + react-native peerDependency ">=0.75.0".
#   7. CI: make the SPM iOS build the blocking gate; drop the vendored job.
#   8. Release: drop dSYM check/attach (dSYMs come from the GCP/upstream flow).
# ---------------------------------------------------------------------------
talsec_spm_url = 'https://github.com/talsec/TODO-freerasp-ios-spm' # TODO(SPM infra): real manifest repo
talsec_spm_min_version = '0.0.0' # TODO(SPM infra): real version once the manifest repo is tagged

Pod::Spec.new do |s|
  s.name         = "freerasp-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/talsec/freerasp-react-native.git", :tag => "#{s.version}" }

  # Opt-in Swift Package Manager integration for the TalsecRuntime dependency.
  # Enabled only when FREERASP_USE_SPM=1 AND the running React Native provides the
  # spm_dependency helper (RN >= 0.75). Otherwise the vendored xcframework is used
  # (default — no breaking change for existing consumers). The SPM path additionally
  # requires USE_FRAMEWORKS=dynamic in the consumer Podfile and iOS 13+.
  use_spm = ENV['FREERASP_USE_SPM'] == '1' && respond_to?(:spm_dependency, true)

  source_globs = [
    'ios/models/*.{h,m,mm,swift}',
    'ios/utils/*.{h,m,mm,swift}',
    'ios/dispatchers/*.{h,m,mm,swift}',
    'ios/*.{h,m,mm,swift}',
  ]

  if use_spm
    # TalsecRuntime is resolved via Swift Package Manager (dedicated RN-flavour manifest repo).
    # spm_dependency injects an SPM reference into the Pods-generated Xcode project.
    # NOTE: the vendored xcframework is intentionally NOT linked here to avoid
    # duplicate symbols.
    # TODO(SPM infra): placeholders above — this branch is not usable until the infra lands.
    s.ios.deployment_target = '13.0'
    spm_dependency(s,
      url: talsec_spm_url,
      requirement: { kind: 'upToNextMajorVersion', minimumVersion: talsec_spm_min_version },
      products: ['TalsecRuntime']
    )
  else
    # TalsecRuntime is provided by the vendored xcframework (default).
    source_globs << 'ios/TalsecRuntime.xcframework'
    s.xcconfig = { 'OTHER_LDFLAGS' => '-framework TalsecRuntime' }
    s.ios.vendored_frameworks = 'ios/TalsecRuntime.xcframework'
  end

  s.source_files = source_globs

  # Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
  # See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
    # Don't install the dependencies when we run `pod install` in the old architecture.
    if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig    = {
          "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
          "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
          "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
      }
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end
end
