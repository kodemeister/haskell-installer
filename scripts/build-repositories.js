import "dotenv/config";

import fs from "fs";
import child_process from "child_process";

const qtInstallerFrameworkDir = process.env.QT_INSTALLER_FRAMEWORK_DIR;

const buildDir = "build";
const packagesDir = "packages";
const repositoriesDir = "repositories";
const repogenPath = `${qtInstallerFrameworkDir}/bin/repogen`;

const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isDirectory()) {
    const params = [
      "--remove",
      "--packages",
      `${packagesDir}/${entry.name}`,
      `${buildDir}/${repositoriesDir}/${entry.name}`,
    ];
    child_process.execFileSync(repogenPath, params);
  }
}
