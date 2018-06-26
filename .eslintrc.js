module.exports = {
	root: true, // make to not take in any user specified rules in parent folders
	parser: "babel-eslint",
	extends: ["airbnb", "prettier", "prettier/flowtype", "prettier/react"],
	env: {
		browser: true,
		node: true,
		jest: true
	},
	plugins: ["standard", "prettier", "flowtype", "react"],
	rules: {
		"template-curly-spacing": ["error", "never"],
		"func-names": [2, "as-needed" ],
		"react/prop-types": 0,
		"no-plusplus": 0,
		"no-return-assign": [2, "except-parens"],
		"no-restricted-syntax": [
			"error",
			"LabeledStatement",
			"WithStatement"
		]
	}
};
