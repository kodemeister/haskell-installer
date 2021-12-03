class Component {
  constructor() {
    // Export functions from this module via 'installer' global object.
    installer.createGhcOperations = this.createGhcOperations;
  }

  createGhcOperations(ghcComponent, archive, archiveRootDir = "") {
    const version = ghcComponent.value("Version");
    const ghcDir = `${installer.value("TargetDir")}/ghc`;
    const installDir = `${ghcDir}/${version}`;

    if (systemInfo.kernelType === "winnt") {
      // On Windows simply unpack GHC bindist to the installation directory.
      if (archiveRootDir !== "") {
        ghcComponent.addOperation("Extract", archive, ghcDir);
        ghcComponent.addOperation(
          "Execute",
          "cmd",
          "/C",
          "IF",
          "EXIST",
          installer.toNativeSeparators(installDir),
          "RMDIR",
          "/S",
          "/Q",
          installer.toNativeSeparators(installDir)
        );
        ghcComponent.addOperation(
          "Execute",
          "cmd",
          "/C",
          "RENAME",
          installer.toNativeSeparators(`${ghcDir}/${archiveRootDir}`),
          version
        );
        ghcComponent.registerPathForUninstallation(installDir, true);
      } else {
        ghcComponent.addOperation("Extract", archive, installDir);
      }
    } else {
      // On Unix first unpack GHC to the temporary directory and then run
      // configure followed by make install.
      const tempDir = installer.generateTempPath("ghc");
      const workingDir =
        archiveRootDir !== "" ? `${tempDir}/${archiveRootDir}` : tempDir;

      ghcComponent.addOperation("Extract", archive, tempDir);
      ghcComponent.addOperation(
        "Execute",
        "workingdirectory=" + workingDir,
        "sh",
        "./configure",
        "--prefix=" + installDir
      );
      ghcComponent.addOperation(
        "Execute",
        "workingdirectory=" + workingDir,
        "make",
        "install"
      );
      ghcComponent.addOperation("Execute", "rm", "-rf", tempDir);
      ghcComponent.registerPathForUninstallation(installDir, true);
    }
  }
}
