# flatpkg - ship flat NPM packages.

Want to publish specific directories as a flat NPM package? Then this is the tool for you.

TLDR; There's no way to do this using only `npm`. A great summary of all the trials and tribulations here: https://stackoverflow.com/questions/38935176/how-to-npm-publish-specific-folder-but-as-package-root

## Usage

From the root directory of your project, run `npx flatpkg dir1 dir2 ...`.

This will automatically copy package.json, and any dirs specified, to a temporary ./.pkg directory and npm publish.
