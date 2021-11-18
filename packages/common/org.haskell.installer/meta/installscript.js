function Component() {}

installer.generateTempPath = (prefix = "tmp", length = 6) => {
  const tempDir = QDesktopServices.storageLocation(
    QDesktopServices.TempLocation
  );
  const charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const uuid = [...Array(length)]
    .map(() => charSet[Math.floor(Math.random() * charSet.length)])
    .join("");
  return `${tempDir}/${prefix}.${uuid}`;
};
