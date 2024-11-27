/**
 * CommitLint configuration rules.
 * @see https://commitlint.js.org/reference/rules.html
 * @see https://commitlint.js.org/reference/rules-configuration.html
 * @type {import("@commitlint/types").UserConfig}
 */
export default {
    // https://www.conventionalcommits.org/en/v1.0.0/
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["chore", "feat", "fix", "refactor", "docs", "revert"],
        ],
        "scope-empty": [2, "never"],
        "scope-enum": [2, "always", ["global", "source", "commitlint-config"]],
        "header-trim": [2, "always"],
        "header-case": [2, "always", ["lower-case"]],
        "header-max-length": [1, "always", 72],
        "body-empty": [1, "never"],
        "body-leading-blank": [2, "always"],
        "body-max-line-length": [2, "always", 72],
        "footer-leading-blank": [2, "always"],
        "footer-max-line-length": [2, "always", 72],
        "trailer-exists": [1, "always"],
    },
};
