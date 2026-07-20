require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# TalsecRuntime: local SPM manifest by default (RN >= 0.75), vendored xcframework
# fallback. The manifest pins the remote binary URL and checksum.
# Opt out of SPM with FREERASP_DISABLE_SPM=1.
talsec_spm_path = File.expand_path('ios/TalsecRuntimePackage', __dir__)

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
    # SPM injects the reference into the Pods project; the framework is embedded into the
    # app target by freerasp_embed_talsec_spm! (freerasp_spm.rb), called from the Podfile.
    s.ios.deployment_target = '13.0'
    spm_dependency(s,
      url: talsec_spm_path,
      requirement: {},
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
