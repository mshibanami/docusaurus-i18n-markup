/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import type { PluginVersionInformation } from '@docusaurus/types';

async function loadPackageJsonVersion(
  packageJsonPath: string,
): Promise<string | undefined> {
  if (await fs.pathExists(packageJsonPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    return (require(packageJsonPath) as { version?: string }).version;
  }
  return undefined;
}

async function loadPackageJsonName(
  packageJsonPath: string,
): Promise<string | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
  return (require(packageJsonPath) as { name?: string }).name;
}

export async function loadSiteVersion(
  siteDir: string,
): Promise<string | undefined> {
  return loadPackageJsonVersion(path.join(siteDir, 'package.json'));
}

export async function loadPluginVersion(
  pluginPath: string,
  siteDir: string,
): Promise<PluginVersionInformation> {
  let potentialPluginPackageJsonDirectory = path.dirname(pluginPath);
  while (potentialPluginPackageJsonDirectory !== '/') {
    const packageJsonPath = path.join(
      potentialPluginPackageJsonDirectory,
      'package.json',
    );
    if (
      (await fs.pathExists(packageJsonPath)) &&
      (await fs.lstat(packageJsonPath)).isFile()
    ) {
      if (potentialPluginPackageJsonDirectory === siteDir) {
        // If the plugin belongs to the same docusaurus project, we classify it
        // as local plugin.
        return { type: 'project' };
      }
      return {
        type: 'package',
        name: await loadPackageJsonName(packageJsonPath),
        version: await loadPackageJsonVersion(packageJsonPath),
      };
    }
    potentialPluginPackageJsonDirectory = path.dirname(
      potentialPluginPackageJsonDirectory,
    );
  }
  // In the case where a plugin is a path where no parent directory contains
  // package.json, we can only classify it as local. Could happen if one puts a
  // script in the parent directory of the site.
  return { type: 'local' };
}
