class Component {
  createOperationsForArchive(archive) {
    installer.createGhcOperations(
      component,
      archive,
      "ghc-9.2.1-x86_64-unknown-linux"
    );
  }
}
