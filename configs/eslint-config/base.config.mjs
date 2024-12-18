import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint/eslint-plugin"],
        extends: [
            "plugin:@typescript-eslint/recommended",
            "plugin:prettier/recommended",
        ],
        rules: {
            "prettier/prettier": "warn",
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    }),
];

export default eslintConfig;
