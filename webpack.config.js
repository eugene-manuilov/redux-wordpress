const path = require('path');

const webpack = require('webpack');

const config = {};

// entry and context
config.context = path.resolve(__dirname, 'src');
config.entry = './index.js';

// output
config.output = {
	path: path.join(__dirname, 'dist'),
	filename: "redux-wordpress.js",
	library: "ReduxWordPress",
    libraryTarget: 'umd'
};

// define module and plugins
config.module = {rules: []};
config.plugins = [];

// babel loader rule
config.module.rules.push({
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			cacheDirectory: true,
			presets: [
				['env', {
					targets: {
						browsers: ["last 2 versions", "safari >= 7"]
					}
				}]
			]
		}
	}
});

// no emit plugin
config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

module.exports = config;