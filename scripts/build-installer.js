import "dotenv/config";

import fs from "fs";
import child_process from "child_process";

const version = process.env.npm_package_version;
const onlineRepositoryUrl = process.env.ONLINE_REPOSITORY_URL;
const qtInstallerFrameworkDir = process.env.QT_INSTALLER_FRAMEWORK_DIR;

const buildDir = "build";
const configDir = "config";
const configTemplateFile = "config-template.xml";
const configFile = "config.xml";
const packagesDir = "packages";
const installerName = "haskell-installer";
const binaryCreatorPath = `${qtInstallerFrameworkDir}/bin/binarycreator`;

const data = fs
  .readFileSync(`${configDir}/${configTemplateFile}`, "utf8")
  .replace(/@VERSION@/g, version)
  .replace(/@ONLINE_REPOSITORY_URL@/g, onlineRepositoryUrl);

fs.mkdirSync(`${buildDir}/${configDir}`, { recursive: true });
fs.writeFileSync(`${buildDir}/${configDir}/${configFile}`, data);

const params = [
  "--online-only",
  "--config",
  `${buildDir}/${configDir}/${configFile}`,
  "--packages",
  `${packagesDir}/main`,
  `${buildDir}/${installerName}`,
];
child_process.execFileSync(binaryCreatorPath, params);
