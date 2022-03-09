import child_process from "child_process";
import crypto from "crypto";
import "dotenv/config";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import os from "os";
import path from "path";

function parseComponentVersion(updatesFilePath, componentName) {
  const fileContent = fs.readFileSync(updatesFilePath, "utf8");
  const parser = new XMLParser();
  const rootObject = parser.parse(fileContent);
  const componentObject = rootObject.Updates.PackageUpdate.find(
    (object) => object.Name === componentName
  );
  return componentObject.Version;
}

function createArchive(archivePath, dataDirPath) {
  const qtInstallerFrameworkDirPath =
    process.env.QT_INSTALLER_FRAMEWORK_DIR_PATH;
  const extension = os.platform() === "win32" ? ".exe" : "";
  const archivegenName = "archivegen" + extension;
  const archivegenPath = qtInstallerFrameworkDirPath
    ? path.join(qtInstallerFrameworkDirPath, "bin", archivegenName)
    : archivegenName;
  const args = [archivePath, dataDirPath];
  child_process.execFileSync(archivegenPath, args);
}

function calcFileHash(filePath, algorithm) {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto.createHash(algorithm);
  hash.update(fileContent);
  return hash.digest("hex");
}

function replacePlaceholders(filePath, placeholders) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(placeholders)) {
    const regExp = new RegExp(`@${key}@`, "g");
    fileContent = fileContent.replace(regExp, value);
  }
  fs.writeFileSync(filePath, fileContent);
}

function main() {
  const buildDirPath = path.resolve("build");
  fs.mkdirSync(buildDirPath, { recursive: true });

  const sourceDirPath = path.resolve("repositories");
  const targetDirPath = path.join(buildDirPath, "repositories");
  fs.rmSync(targetDirPath, { force: true, recursive: true });
  fs.cpSync(sourceDirPath, targetDirPath, { recursive: true });

  const mainRepositoryDirPath = path.join(targetDirPath, "main");
  const updatesFilePath = path.join(mainRepositoryDirPath, "Updates.xml");
  const componentName = "installer";
  const metadataVersion = parseComponentVersion(updatesFilePath, componentName);

  const componentDirPath = path.join(mainRepositoryDirPath, componentName);
  fs.mkdirSync(componentDirPath);

  const metadataArchiveName = `${metadataVersion}meta.7z`;
  const metadataArchivePath = path.join(componentDirPath, metadataArchiveName);
  const metadataDirPath = path.resolve("src", componentName);
  createArchive(metadataArchivePath, metadataDirPath);

  const metadataSha1 = calcFileHash(metadataArchivePath, "sha1");
  const placeholders = { INSTALLER_METADATA_SHA1: metadataSha1 };
  replacePlaceholders(updatesFilePath, placeholders);
}

main();
