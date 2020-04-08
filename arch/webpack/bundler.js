import webpack from "webpack";

export default (webpackConfig) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err);

      return;
    }

    console.log(
      stats.toString({
        // do not log child plugin outputs
        children: false,
        // Makes the build much quieter
        chunks: false,
        // Shows colors in the console
        colors: true
      })
    );
  });
};
