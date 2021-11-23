class Component {
  constructor() {
    installer.createGhcOperations = this.createGhcOperations;
  }

  createGhcOperations(ghcComponent, archive, archiveDir) {
    const version = ghcComponent.value("Version");

    const tempDir = installer.generateTempPath("ghc");
    const workingDir = archiveDir !== "" ? `${tempDir}/${archiveDir}` : tempDir;
    const installDir = `@TargetDir@/ghc/${version}`;

    const configureParams = [
      "workingdirectory=" + workingDir,
      "sh",
      "./configure",
      "--prefix=" + installDir,
    ];

    const makeParams = [
      "workingdirectory=" + workingDir,
      "make",
      "install",
      "UNDOEXECUTE",
      "rm",
      "-rf",
      installDir,
    ];

    ghcComponent.addOperation("Extract", archive, tempDir);
    ghcComponent.addOperation("Execute", configureParams);
    ghcComponent.addOperation("Execute", makeParams);
    ghcComponent.addOperation("Execute", "rm", "-rf", tempDir);
  }
}
