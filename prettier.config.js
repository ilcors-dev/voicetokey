module.exports = {
    printWidth: 80,
    trailingComma: 'all',
    singleQuote: true,
    tabWidth: 2,
    indentStyle: 'space',
    semi: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
    plugins: [require('prettier-plugin-tailwindcss')],
};