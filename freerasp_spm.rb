# freeRASP — embeds the SPM-delivered TalsecRuntime into the app target(s). spm_dependency
# only attaches it to the pod target, so dyld fails at launch otherwise. Idempotent and safe
# to call unconditionally: removes any stale reference, re-adds only when SPM is active.
# Keep url/requirement in sync with freerasp-react-native.podspec.

def freerasp_embed_talsec_spm!(installer,
  url: 'https://github.com/talsec/Free-RASP-ReactNative-SPM',
  requirement: { kind: 'exactVersion', version: '6.14.4' },
  product: 'TalsecRuntime')

  pkg_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference
  ref_class = Xcodeproj::Project::Object::XCSwiftPackageProductDependency

  # Mirror the podspec: SPM active unless unavailable (RN < 0.75) or opted out.
  spm_active = respond_to?(:spm_dependency, true) && ENV['FREERASP_DISABLE_SPM'] != '1'

  installer.aggregate_targets.each do |aggregate_target|
    project = aggregate_target.user_project
    next if project.nil?

    app_targets = aggregate_target.user_targets.select do |t|
      t.respond_to?(:product_type) && t.product_type == 'com.apple.product-type.application'
    end

    # Remove any previously-added reference first (avoids a double embed on delivery switch).
    app_targets.each do |target|
      target.package_product_dependencies.delete_if do |r|
        r.class == ref_class && r.product_name == product &&
          r.package.respond_to?(:repositoryURL) && r.package.repositoryURL == url
      end
    end
    project.root_object.package_references.delete_if do |p|
      p.class == pkg_class && p.repositoryURL == url
    end

    if spm_active
      pkg = project.new(pkg_class)
      pkg.repositoryURL = url
      pkg.requirement = requirement
      project.root_object.package_references << pkg

      app_targets.each do |target|
        Pod::UI.puts "[freeRASP][SPM] Embedding #{product} into app target #{target.name}"
        dep = project.new(ref_class)
        dep.package = pkg
        dep.product_name = product
        target.package_product_dependencies << dep
      end
    end

    project.save
  end
end
