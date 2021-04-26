const withQuotes = (value) => (typeof value === 'number' ? value : `'${value}'`);

module.exports = withQuotes;
