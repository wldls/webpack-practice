const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const apiMocker = require('connect-api-mocker');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
	mode,
	entry: {
		main: './src/app.js',
		// result: './src/result.js'
	},
	output: {
		path: path.resolve('./dist'),
		filename: '[name].js'
	},	
	devServer: {
		// contentBase: path.join(__dirname, "dist"),
		// publicPath: "/",
		// host: "",
		proxy: {'/api': 'http://localhost:8081'},
		overlay: true,
		// port: 3000,
		stats: "errors-only",
		hot: true,
		before: (app) => {
			app.use(apiMocker('/api', 'mocks/api'));
			// app.get("/api/users/", (req, res) => {
			// 	res.json([
			// 		{
			// 			id: 1,
			// 			name: "Alice"
			// 		},
			// 		{
			// 			id: 2,
			// 			name: "Bek"
			// 		},
			// 		{
			// 			id: 3,
			// 			name: "Chris"
			// 		},
			// 	])
			// })
		}
		// historyApiFallback: true	// spa 개발시 사용
	},
	optimization: {
		minimizer: mode === 'production' ? [
			new OptimizeCSSAssetsPlugin(),
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true	// 콘솔 로그를 제거
					}
				}
			})
		] : [],
		// splitChunks: {
		// 	chunks: "all"
		// }
	},
	externals: {
		axios: 'axios'	// 웹팩으로 build할 때 aixos를 사용하는 부분이 있으면 전역변수 axios를 사용
	},
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					process.env.NODE_ENV === 'production'
					? MiniCssExtractPlugin.loader
					: 'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader',
				options: {
					// publicPath: './',
					name: '[name].[ext]?[hash]',
					limit: 20000, // 20kb
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: `
				Build Date: ${new Date().toLocaleString()}
				Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
				Author: ${childProcess.execSync('git config user.name')}
			`
		}),
		new webpack.DefinePlugin({
			TWO: JSON.stringify('1+1'),
			'api.domain': JSON.stringify('http://dev.api.domain.com')
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			templateParameters: {
				env: process.env.NODE_ENV === 'development' ? '(개발용)' : ''
			},
			minify: process.env.NODE_ENV === 'production' ? {
				collapseWhitespace: true,
				removeComments: true
			} : false
		}),
		new CleanWebpackPlugin(),
		...(process.env.NODE_ENV === 'production'
			? [new MiniCssExtractPlugin({ filename: '[name].css' })]
			: []
		),
		new CopyPlugin([{
			from: './node_modules/axios/dist/axios.min.js',
			to: './axios.min.js'
		}])
	]
}

