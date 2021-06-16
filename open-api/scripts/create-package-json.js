const fs = require("fs");
fs.writeFileSync(
  "dist/typescript-rxjs/package.json",
  `{
  "name": "${process.argv[2]}",
  "version": "${process.argv[3]}",
  "description": "This package contains the OpenAPI as RxJs implementation for ${process.argv[2]}.",
  "devDependencies": {
    "typescript": "4.2.4"
  },
  "files": [
    "dist"
  ],
  "main": "dist/index.js",
  "scripts": {
    "prepack": "tsc"
  }
}`,
  {
    encoding: "utf8",
  }
);
