# Contributing

Thank you for your interest in contributing to this project!

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build all packages:
   ```bash
   pnpm build
   ```

## Making Changes

### Creating a Changeset

When you make changes that should be released, you need to create a changeset:

```bash
pnpm changeset
```

This will prompt you to:
1. **Select packages** - Choose which packages are affected by your changes
2. **Select bump type** - Choose the version bump for each package:
   - `patch` - Bug fixes and minor changes (0.0.X)
   - `minor` - New features, backward compatible (0.X.0)
   - `major` - Breaking changes (X.0.0)
3. **Write a summary** - Describe your changes (this will appear in the changelog)

A markdown file will be created in the `.changeset` directory. Commit this file with your changes.

### Pull Request Guidelines

1. Create a new branch for your changes
2. Make your changes and add tests if applicable
3. Run `pnpm changeset` to create a changeset
4. Submit a pull request with both your code changes and the changeset file

## Release Process

The release process is fully automated via GitHub Actions:

1. **When your PR merges** - The CI detects changeset files
2. **Version PR is created** - A "Version Packages" PR is automatically created/updated with:
   - Updated version numbers in `package.json` files
   - Generated/updated `CHANGELOG.md` files
   - Consumed changeset files (deleted)
3. **When the Version PR merges** - Packages are:
   - Published to npm
   - Tagged with git tags (e.g., `docusaurus-i18n-markup@1.2.0`)
   - GitHub Releases are created

For maintainer setup instructions, see [docs/releasing.md](./docs/releasing.md).

### Version Bump Types

| Type | When to Use | Example |
|------|-------------|---------|
| `patch` | Bug fixes, documentation updates | 1.0.0 → 1.0.1 |
| `minor` | New features (backward compatible) | 1.0.0 → 1.1.0 |
| `major` | Breaking changes | 1.0.0 → 2.0.0 |

## Repository Structure

```
├── packages/
│   ├── docusaurus-i18n-markup/          # React components package
│   └── docusaurus-plugin-write-translations-plus/  # Docusaurus plugin
├── testsite/                             # Test Docusaurus site
└── .changeset/                           # Changeset files
```

## Questions?

If you have questions about the contribution process, please open an issue.
