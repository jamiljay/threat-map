const webpack = require("webpack");
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CleanWebpackPlugin = require("clean-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "dist");
const CLIENT_DIR = path.resolve(__dirname, "client");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const PUBLIC_PATH = "/";

const clientConfig = {
	target: "web",
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	entry: {
		app: `${CLIENT_DIR}/index.jsx`
	},
	devServer: {
		port: 5000,
		contentBase: "client/",
		publicPath: PUBLIC_PATH,
		historyApiFallback: true,
		inline: true,
		hot: true,
		proxy: {
			"/rest": {
				target: "http://localhost:8080",
				changeOrigin: true,
				secure: false
			}
		}
	},
	output: {
		path: BUILD_DIR,
		publicPath: PUBLIC_PATH,
		filename: "assets/[name].js"
	},
	resolve: {
		extensions: [".js", ".jsx", ".scss"]
	},
	module: {
		rules: [
			{
				test: /\.jsx?/,
				exclude: /node_modules|.json/,
				use: [
					{
						loader: "babel-loader",
						options: {
							babelrc: false,
							presets: [["env", { modules: false }], "react", "stage-2"],
							plugins: ["react-hot-loader/babel", "transform-runtime"]
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [process.env.DEV_SERVER ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					process.env.DEV_SERVER ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(jpg|jpeg|gif|png)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 1024,
							name: "assets/images/[name].[ext]"
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 1024,
							name: "assets/fonts/[name].[ext]"
						}
					}
				]
			}
		]
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			automaticNameDelimiter: "-",
			name: true,
			cacheGroups: {
				vendors: {
					name: "vendors",
					test: /[\\/]node_modules[\\/]/,
					priority: -5
				},
				default: {
					priority: -10,
					reuseExistingChunk: true
				}
			}
		}
	},
	plugins: [

		// adds package variables
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "client/index.html",
			inject: true,
			hash: true
		}),

		new CopyWebpackPlugin([
			{ 
				from: './client/app/components/map/world-110m.json', 
				to: 'assets/files/' 
			}
		])
	]
};

if ( process.env.DEV_SERVER ) {
	clientConfig.plugins.push(new webpack.NamedModulesPlugin());
	clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	
// do not delete build files when files are served from memory
} else {
	clientConfig.plugins.push(new CleanWebpackPlugin([BUILD_DIR]));
	clientConfig.plugins.push(new MiniCssExtractPlugin({filename: "assets/[name].css"}));
}

// provide source maps for dev and test
if (process.env.NODE_ENV !== "production") {
	clientConfig.devtool = "source-map";
}


module.exports = clientConfig;
