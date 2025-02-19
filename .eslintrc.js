const path = require("path");

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "plugin:import/recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "prettier"],
    rules: {
        "react/react-in-jsx-scope": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "max-len": ["error", { code: 140, ignoreUrls: true }],
        "react/prop-types": "off",
        "react/jsx-boolean-value": "off",
        "react/jsx-no-bind": "off",
        "no-shadow": "off",
        "class-methods-use-this": "off",
        "react/no-array-index-key": "off",
        "no-underscore-dangle": "off",
        "consistent-return": "off",
        "import/prefer-default-export": "off",
        camelcase: "off",
        "react/button-has-type": "off",
        "jsx-a11y/no-redundant-roles": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
    },
};
