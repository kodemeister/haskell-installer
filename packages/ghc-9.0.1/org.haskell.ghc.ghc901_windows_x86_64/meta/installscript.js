class Component {
  createOperationsForArchive(archive) {
    installer.createGhcOperations(
      component,
      archive,
      "ghc-9.0.1-x86_64-unknown-mingw32"
    );
  }
}
