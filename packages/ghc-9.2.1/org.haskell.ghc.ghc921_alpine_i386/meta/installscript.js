class Component {
  createOperationsForArchive(archive) {
    installer.createGhcOperations(
      component,
      archive,
      "ghc-9.2.1-i386-unknown-linux"
    );
  }
}
