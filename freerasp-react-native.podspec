require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# ---------------------------------------------------------------------------
# TalsecRuntime delivery — Swift Package Manager by default, vendored fallback.
# (Same decision logic as react-native-firebase, non-breaking.)
#
#   spm_dependency available (RN >= 0.75) AND FREERASP_DISABLE_SPM != '1'
#        -> SPM (dedicated RN-flavour manifest repo)
#   otherwise (RN < 0.75, or FREERASP_DISABLE_SPM=1)
#        -> vendored TalsecRuntime.xcframework
#
# The SPM path requires USE_FRAMEWORKS=dynamic and iOS 13+. The vendored fallback
# keeps working on any RN / linkage, so this is not a breaking change.
#
# TODO(SPM infra): the dedicated RN-flavour manifest repo (which hosts the GCS-backed
# xcframework via binaryTarget) is NOT ready yet, so the values below are PLACEHOLDERS
# — the SPM path won't resolve until it exists; consumers fall back to vendored.
# IMPORTANT: point at the RN-flavour manifest repo — NOT talsec/Free-RASP-iOS
# (that is the native flavour and the wrong artifact for React Native).
# ---------------------------------------------------------------------------
talsec_spm_url = 'https://github.com/talsec/TODO-freerasp-ios-spm' # TODO(SPM infra): real manifest repo git URL
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

  # SPM is the default whenever the spm_dependency helper is available (RN >= 0.75),
  # unless the consumer opts out with FREERASP_DISABLE_SPM=1.
  use_spm = respond_to?(:spm_dependency, true) && ENV['FREERASP_DISABLE_SPM'] != '1'

  source_globs = [
    'ios/models/*.{h,m,mm,swift}',
    'ios/utils/*.{h,m,mm,swift}',
    'ios/dispatchers/*.{h,m,mm,swift}',
    'ios/*.{h,m,mm,swift}',
  ]

  if use_spm
    # TalsecRuntime resolved via Swift Package Manager (dedicated RN-flavour manifest repo).
    # spm_dependency injects the SPM reference into the Pods project; the framework is
    # embedded into the app target by `freerasp_embed_talsec_spm!` (freerasp_spm.rb),
    # called from the consumer Podfile post_install.
    # TODO(SPM infra): placeholders above — this path is not usable until the infra lands.
    s.ios.deployment_target = '13.0'
    spm_dependency(s,
      url: talsec_spm_url,
      requirement: { kind: 'upToNextMajorVersion', minimumVersion: talsec_spm_min_version },
      products: ['TalsecRuntime']
    )
  else
    # Vendored xcframework fallback (RN < 0.75 or FREERASP_DISABLE_SPM=1).
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
