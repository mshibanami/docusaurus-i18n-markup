/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  DEFAULT_BUILD_DIR_NAME,
  GENERATED_FILES_DIR_NAME,
  getLocaleConfig,
} from '@docusaurus/utils';
import combinePromises from 'combine-promises';
import { getCurrentBundler } from '@docusaurus/bundler';
import { loadSiteConfig } from './config';
import { loadSiteVersion } from './siteMetadata';
import { loadI18n } from './i18n';
import {
  loadSiteCodeTranslations,
} from './translations/translations';
import { createSiteStorage } from './storage';
import type {
  DocusaurusConfig,
  LoadContext,
  Props,
} from '@docusaurus/types';

export type LoadContextParams = {
  /** Usually the CWD; can be overridden with command argument. */
  siteDir: string;
  /** Custom output directory. Can be customized with `--out-dir` option */
  outDir?: string;
  /** Custom config path. Can be customized with `--config` option */
  config?: string;
  /** Default is `i18n.defaultLocale` */
  locale?: string;

  /**
   * By default, we try to automatically infer a localized baseUrl.
   * We prepend `/<siteBaseUrl>/` with a `/<locale>/` path segment,
   * except for the default locale.
   *
   * This option permits opting out of this baseUrl localization process.
   * It is mostly useful to simplify config for multi-domain i18n deployments.
   * See https://docusaurus.io/docs/i18n/tutorial#multi-domain-deployment
   *
   * In all cases, this process doesn't happen if an explicit localized baseUrl
   * has been provided using `i18n.localeConfigs[].baseUrl`. We always use the
   * provided value over the inferred one, letting you override it.
   */
  automaticBaseUrlLocalizationDisabled?: boolean;
};

export type LoadSiteParams = LoadContextParams & {
  isReload?: boolean;
};

export type Site = {
  props: Props;
  params: LoadSiteParams;
};

/**
 * Loading context is the very first step in site building. Its params are
 * directly acquired from CLI options. It mainly loads `siteConfig` and the i18n
 * context (which includes code translations). The `LoadContext` will be passed
 * to plugin constructors.
 */
export async function loadContext(
  params: LoadContextParams,
): Promise<LoadContext> {
  const {
    siteDir,
    outDir: baseOutDir = DEFAULT_BUILD_DIR_NAME,
    locale,
    config: customConfigFilePath,
    automaticBaseUrlLocalizationDisabled,
  } = params;
  const generatedFilesDir = path.resolve(siteDir, GENERATED_FILES_DIR_NAME);

  const {
    siteVersion,
    loadSiteConfig: { siteConfig: initialSiteConfig, siteConfigPath },
  } = await combinePromises({
    siteVersion: loadSiteVersion(siteDir),
    loadSiteConfig: loadSiteConfig({
      siteDir,
      customConfigFilePath,
    }),
  });

  const currentBundler = await getCurrentBundler({
    siteConfig: initialSiteConfig,
  });

  const i18n = await loadI18n({
    siteDir,
    config: initialSiteConfig,
    currentLocale: locale ?? initialSiteConfig.i18n.defaultLocale,
    automaticBaseUrlLocalizationDisabled:
      automaticBaseUrlLocalizationDisabled ?? false,
  });

  const localeConfig = getLocaleConfig(i18n);

  // We use the baseUrl from the locale config.
  // By default, it is inferred as /<siteConfig.baseUrl>/
  // eventually including the /<locale>/ suffix
  const baseUrl = localeConfig.baseUrl;

  // TODO not ideal: we should allow configuring a custom outDir for each locale
  // The site baseUrl should be 100% decoupled from the file system output shape
  // We added this logic to restore v3 retro-compatibility, because by default
  // Docusaurus always wrote to ./build for sites having a baseUrl
  // See also https://github.com/facebook/docusaurus/issues/11433
  // This logic assumes the locale baseUrl will start with the site baseUrl
  // which is the case if an explicit locale baseUrl is not provided
  // but in practice a custom locale baseUrl could be anything now
  const outDirBaseUrl = baseUrl.replace(initialSiteConfig.baseUrl, '/');

  const outDir = path.join(path.resolve(siteDir, baseOutDir), outDirBaseUrl);

  const localizationDir = path.resolve(
    siteDir,
    i18n.path,
    getLocaleConfig(i18n).path,
  );

  const siteConfig: DocusaurusConfig = {
    ...initialSiteConfig,
    baseUrl,
  };

  const codeTranslations = await loadSiteCodeTranslations({ localizationDir });

  const siteStorage = createSiteStorage(siteConfig);

  return {
    siteDir,
    siteVersion,
    siteStorage,
    generatedFilesDir,
    localizationDir,
    siteConfig,
    siteConfigPath,
    outDir,
    baseUrl,
    i18n,
    codeTranslations,
    currentBundler,
  };
}
