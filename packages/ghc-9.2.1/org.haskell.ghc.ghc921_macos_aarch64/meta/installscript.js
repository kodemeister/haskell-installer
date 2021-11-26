class Component {
  createOperationsForArchive(archive) {
    installer.createGhcOperations(
      component,
      archive,
      "ghc-9.2.1-aarch64-apple-darwin"
    );
  }
}
