class Component {
  constructor() {
    // Export functions from this module via 'installer' global object.
    installer.generateTempPath = this.generateTempPath;
  }

  generateTempPath(prefix = "tmp", length = 16) {
    const tempDir = QDesktopServices.storageLocation(
      QDesktopServices.TempLocation
    );
    const uuid = [...Array(length)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    return `${tempDir}/${prefix}-${uuid}`;
  }
}
