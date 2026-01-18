module.exports = [
    {
        ignores: ["public/**", "node_modules/**"]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs"
        },
        rules: {}
    }
];

