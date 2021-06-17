const fs = require("fs");
fs.writeFileSync(
  "dist/typescript-rxjs/package.json",
  `{
  "name": "@${process.argv[2]}/${process.argv[3]}",
  "version": "${process.argv[4]}",
  "description": "This package contains the OpenAPI as RxJs implementation for @${process.argv[2]}/${process.argv[3]}.",
  "devDependencies": {
    "rxjs": "^6",
    "typescript": "^4"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/${process.argv[5]}"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "prepack": "tsc"
  },
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bugs": {
    "url": "https://github.com/${process.argv[5]}/issues"
  },
  "publishConfig": {
    "access": "restricted",
    "registry": "https://npm.pkg.github.com"
  }
}`,
  {
    encoding: "utf8",
  }
);
