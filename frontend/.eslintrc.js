module.exports = {
  root: true,
  ignorePatterns: ["projects/**/*"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: ["tsconfig.json", "e2e/tsconfig.json"],
        // https://stackoverflow.com/questions/64933543/parsing-error-cannot-read-file-tsconfig-json-eslint
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        /**
         * Für den Einstieg empfehle ich das auszukommentieren.
         * Da hier noch 1.900 Code Smells verborgen sind.
         * Wir sollten diese aber nicht vernachlässigen.
         */
        // "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@angular-eslint/ng-cli-compat",
        "plugin:@angular-eslint/ng-cli-compat--formatting-add-on",
        "plugin:@angular-eslint/template/process-inline-templates",
      ],
      rules: {},
    },
    {
      files: ["*.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
  ],
};
