const path = require("path")
module.exports = {
    entry: [
        "./build/babel/app.js",
        "./build/babel/storage.js",
        "./build/babel/categoryView.js",
        "./build/babel/productView.js",
    ],
    output: {
        path: path.resolve(__dirname, "build/webpack"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
            }
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },]
    }
}