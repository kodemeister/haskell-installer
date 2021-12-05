class Component {
  createOperationsForArchive(archive) {
    installer.createGhcOperations(
      component,
      archive,
      "ghc-8.10.6-x86_64-unknown-linux"
    );
  }
}
