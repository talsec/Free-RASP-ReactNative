# freeRASP — links the local TalsecRuntime Swift package to the pod and embeds its
# product into the app target(s). React Native 0.75–0.83 treats local package paths
# as remote URLs, so this helper also replaces that invalid reference after
# react_native_post_install. It is idempotent and safe to call unconditionally.

def freerasp_embed_talsec_spm!(installer,
  package_path: File.expand_path('ios/TalsecRuntimePackage', __dir__),
  product: 'TalsecRuntime')

  package_path = File.expand_path(package_path)
  local_pkg_class = Xcodeproj::Project::Object::XCLocalSwiftPackageReference
  remote_pkg_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference
  ref_class = Xcodeproj::Project::Object::XCSwiftPackageProductDependency

  # Mirror the podspec: SPM is explicit and requires RN's spm_dependency helper.
  spm_active = ENV['FREERASP_USE_SPM'] == '1' &&
    respond_to?(:spm_dependency, true)

  if spm_active && !File.file?(File.join(package_path, 'Package.swift'))
    raise Pod::Informative, "[freeRASP][SPM] Package.swift not found at #{package_path}"
  end

  projects_and_targets = {}
  pods_project = installer.pods_project
  projects_and_targets[pods_project] = pods_project.targets.select do |target|
    target.name == 'freerasp-react-native'
  end

  installer.aggregate_targets.each do |aggregate_target|
    project = aggregate_target.user_project
    next if project.nil?

    app_targets = aggregate_target.user_targets.select do |t|
      t.respond_to?(:product_type) && t.product_type == 'com.apple.product-type.application'
    end
    projects_and_targets[project] ||= []
    projects_and_targets[project].concat(app_targets)
  end

  new_object = lambda do |project, klass|
    uuid = project.generate_uuid
    uuid = project.generate_uuid while project.objects_by_uuid.key?(uuid)
    object = klass.new(project, uuid)
    object.initialize_defaults
    object
  end

  projects_and_targets.each do |project, targets|
    targets.uniq!

    # Remove references owned by this integration regardless of their previous
    # absolute path. This also cleans references committed from another checkout.
    owned_packages = []
    targets.each do |target|
      target.package_product_dependencies.select do |reference|
        reference.class == ref_class && reference.product_name == product
      end.each do |reference|
        owned_packages << reference.package unless reference.package.nil?
        reference.remove_from_project
      end
    end
    project.root_object.package_references.each do |package|
      reference_path =
        if package.class == local_pkg_class
          package.relative_path
        elsif package.class == remote_pkg_class
          package.repositoryURL
        end
      next if reference_path.nil?

      owned_packages << package if File.basename(reference_path) == 'TalsecRuntimePackage'
    end
    owned_packages.uniq.each do |package|
      package.remove_from_project
    end

    if spm_active
      pkg = new_object.call(project, local_pkg_class)
      pkg.relative_path = package_path
      project.root_object.package_references << pkg

      targets.each do |target|
        Pod::UI.puts "[freeRASP][SPM] Linking #{product} to target #{target.name}"
        dep = new_object.call(project, ref_class)
        dep.package = pkg
        dep.product_name = product
        target.package_product_dependencies << dep
      end
    end

    project.save
  end
end
