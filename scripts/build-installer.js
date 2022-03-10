import child_process from "child_process";
import "dotenv/config";
import fs from "fs";
import os from "os";
import path from "path";

function getOsName() {
  switch (os.platform()) {
    case "win32":
      return "windows";
    default:
      throw new Error(`Operating system '${os.platform()}' is not supported`);
  }
}

function getCpuArchitecture() {
  switch (os.arch()) {
    case "x64":
      return "x86_64";
    default:
      throw new Error(`CPU architecture '${os.arch()}' is not supported`);
  }
}

function getPlatform() {
  return `${getOsName()}_${getCpuArchitecture()}`;
}

function replacePlaceholders(filePath, placeholders) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(placeholders)) {
    const regExp = new RegExp(`@${key}@`, "g");
    fileContent = fileContent.replace(regExp, value);
  }
  fs.writeFileSync(filePath, fileContent);
}

function createInstaller(installerPath, configFilePath, repositoryDirPath) {
  const qtInstallerFrameworkDirPath =
    process.env.QT_INSTALLER_FRAMEWORK_DIR_PATH;
  const extension = os.platform() === "win32" ? ".exe" : "";
  const binaryCreatorName = "binarycreator" + extension;
  const binaryCreatorPath = qtInstallerFrameworkDirPath
    ? path.join(qtInstallerFrameworkDirPath, "bin", binaryCreatorName)
    : binaryCreatorName;
  const args = [
    "--online-only",
    "--config",
    configFilePath,
    "--repository",
    repositoryDirPath,
    installerPath,
  ];
  child_process.execFileSync(binaryCreatorPath, args);
}

function main() {
  const buildDirPath = path.resolve("build");
  fs.mkdirSync(buildDirPath, { recursive: true });

  const sourceDirPath = path.resolve("config");
  const targetDirPath = path.join(buildDirPath, "config");
  fs.rmSync(targetDirPath, { force: true, recursive: true });
  fs.cpSync(sourceDirPath, targetDirPath, { recursive: true });

  const configFilePath = path.join(targetDirPath, "config.xml");
  const onlineRepositoriesUrl =
    process.env.ONLINE_REPOSITORIES_URL || "http://localhost:8080";
  const platform = process.env.PLATFORM || getPlatform();
  const placeholders = {
    ONLINE_REPOSITORIES_URL: onlineRepositoriesUrl,
    PLATFORM: platform,
  };
  replacePlaceholders(configFilePath, placeholders);

  const installerPath = path.join(buildDirPath, "haskell-installer");
  const mainRepositoryDirPath = path.resolve("repositories", "main");
  createInstaller(installerPath, configFilePath, mainRepositoryDirPath);
}

main();
