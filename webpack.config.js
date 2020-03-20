const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/app.js'
	},
	output: {
		path: path.resolve('./dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader',
				options: {
					publicPath: './dist/',
					name: '[name].[ext]?[hash]',
					limit: 20000, // 20kb
				}
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: `
				Build Date: ${new Date().toLocaleString()}
				Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
				Author: ${childrocess.execSync('git config user.name')}
			`
		}),
		new webpack.DefinePlugin({
			TWO: JSON.stringify('1+1'),
			'api.domain': JSON.stringify('http://dev.api.domain.com')
		})
	]
}

