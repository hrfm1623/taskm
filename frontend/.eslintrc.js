module.exports = {
  extends: ["next/core-web-vitals"],
  plugins: ["unused-imports", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
