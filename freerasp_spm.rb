# freeRASP — Swift Package Manager (SPM) opt-in helper.
#
# When the opt-in SPM integration is enabled (FREERASP_USE_SPM=1), the podspec
# resolves TalsecRuntime through the `spm_dependency` helper, which attaches the
# package product to the *pod* target only. With dynamically linked frameworks
# (USE_FRAMEWORKS=dynamic) the app then crashes at launch with:
#
#   Library not loaded: @rpath/TalsecRuntime.framework/TalsecRuntime
#
# because nothing embeds the Swift package's binary framework into the app bundle.
#
# Call `freerasp_embed_talsec_spm!(installer)` from your Podfile `post_install`
# (after `react_native_post_install`) to add TalsecRuntime to the application
# target(s) so Xcode embeds and signs it automatically.
#
# Keep the version requirement in sync with `freerasp-react-native.podspec`.
#
# TODO(SPM infra): the `url`/`requirement` defaults below are PLACEHOLDERS. They must
# match `freerasp-react-native.podspec` and point at the dedicated RN-flavour manifest
# repo (NOT talsec/Free-RASP-iOS, which is the native flavour). Not usable until the
# GCP-hosted xcframework + manifest repo infra is ready.

def freerasp_embed_talsec_spm!(installer,
  url: 'https://github.com/talsec/TODO-freerasp-ios-spm',
  requirement: { kind: 'upToNextMajorVersion', minimumVersion: '0.0.0' },
  product: 'TalsecRuntime')

  pkg_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference
  ref_class = Xcodeproj::Project::Object::XCSwiftPackageProductDependency

  installer.aggregate_targets.each do |aggregate_target|
    project = aggregate_target.user_project
    next if project.nil?

    # Find or create the package reference in the application project.
    pkg = project.root_object.package_references.find do |p|
      p.class == pkg_class && p.repositoryURL == url
    end
    unless pkg
      pkg = project.new(pkg_class)
      pkg.repositoryURL = url
      pkg.requirement = requirement
      project.root_object.package_references << pkg
    end

    aggregate_target.user_targets.each do |target|
      next unless target.respond_to?(:product_type) &&
                  target.product_type == 'com.apple.product-type.application'

      # Add the product dependency to the app target; Xcode embeds & signs
      # Swift package framework products of an application target automatically.
      existing = target.package_product_dependencies.find do |r|
        r.class == ref_class && r.package == pkg && r.product_name == product
      end
      next if existing

      Pod::UI.puts "[freeRASP][SPM] Embedding #{product} into app target #{target.name}"
      dep = project.new(ref_class)
      dep.package = pkg
      dep.product_name = product
      target.package_product_dependencies << dep
    end

    project.save
  end
end
