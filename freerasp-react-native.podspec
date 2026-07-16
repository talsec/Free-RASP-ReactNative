require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# ---------------------------------------------------------------------------
# Swift Package Manager (SPM) delivery of TalsecRuntime — STAGE 2 SHAPE.
#
# TalsecRuntime is delivered exclusively via SPM (a dedicated RN-flavour manifest
# repo + a GCP-hosted xcframework). CocoaPods stays for React Native itself;
# `spm_dependency` (RN >= 0.75) injects the SPM reference into the Pods project and
# `freerasp_embed_talsec_spm!` (see freerasp_spm.rb) embeds the framework into the
# app target. Requires USE_FRAMEWORKS=dynamic in the consumer Podfile and iOS 13+.
#
# TODO(SPM infra): the manifest repo + GCP-hosted xcframework are NOT ready yet, so
# the values below are PLACEHOLDERS — the iOS build will not resolve until they exist.
# Before releasing, also: `git rm ios/TalsecRuntime.xcframework` + exclude it from npm,
# major version bump, and drop the dSYM check/attach release steps.
# IMPORTANT: point at the RN-flavour manifest repo — NOT talsec/Free-RASP-iOS
# (that is the native flavour and the wrong artifact for React Native).
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

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/talsec/freerasp-react-native.git", :tag => "#{s.version}" }

  s.source_files = 'ios/models/*.{h,m,mm,swift}',
                   'ios/utils/*.{h,m,mm,swift}',
                   'ios/dispatchers/*.{h,m,mm,swift}',
                   'ios/*.{h,m,mm,swift}'

  # TalsecRuntime is resolved exclusively via Swift Package Manager. spm_dependency
  # (RN >= 0.75) injects the SPM reference into the Pods-generated Xcode project; the
  # binary framework is embedded into the app target by `freerasp_embed_talsec_spm!`
  # (freerasp_spm.rb), called from the consumer Podfile post_install.
  unless respond_to?(:spm_dependency, true)
    raise "[freerasp-react-native] iOS integration requires React Native >= 0.75 (the spm_dependency helper)."
  end
  spm_dependency(s,
    url: talsec_spm_url,
    requirement: { kind: 'upToNextMajorVersion', minimumVersion: talsec_spm_min_version },
    products: ['TalsecRuntime']
  )

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
