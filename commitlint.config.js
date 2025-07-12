export default {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "style", "test"],
        ],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "scope-case": [2, "always", "lower-case"],
        "scope-empty": [0, "always"],
        "scope-enum": [1, "always", ["internal", "release"]],
        "subject-case": [2, "never", ["sentence-case"]],
        "subject-empty": [2, "never"],
        "header-max-length": [1, "always", 100],
        "body-max-line-length": [0, "always", 100],
        "footer-max-line-length": [0, "always", 100],
    },
};
