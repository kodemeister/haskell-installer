class Component {
  constructor() {
    const kernel = systemInfo.kernelType;
    const arch = systemInfo.currentCpuArchitecture;

    if (kernel === "winnt") {
      if (arch === "x86_64") this.showComponents("windows_x86_64");
    } else if (kernel === "darwin") {
      if (arch === "x86_64") this.showComponents("macos_x86_64");
      else if (arch === "arm64") this.showComponents("macos_aarch64");
    } else if (kernel === "linux") {
      if (arch === "x86_64") this.showComponents("fedora27_x86_64");
    }
  }

  showComponents(...platforms) {
    for (const platform of platforms) {
      const componentName = `${component.name}_${platform}`;
      installer.componentByName(componentName).setValue("Virtual", "false");
    }
  }
}
