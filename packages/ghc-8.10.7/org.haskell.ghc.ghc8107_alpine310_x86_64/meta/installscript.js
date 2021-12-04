class Component {
  createOperationsForArchive(archive) {
    installer.createGhcOperations(
      component,
      archive,
      "ghc-8.10.7-x86_64-unknown-linux"
    );
  }
}
