import vm from "vm";
import path from "path";

/**
 * @name LoaderContext
 * @property {function} cacheable
 * @property {function} async
 * @property {function} addDependency
 * @property {function} loadModule
 * @property {string} resourcePath
 * @property {object} options
 */

/**
 * @returns {string}
 */
function rndNumber() {
  return Math.random()
    .toString()
    .slice(2);
}

/**
 * Random placeholder. Marks the location in the source code where the result
 * of other modules should be inserted.
 * @type {string}
 */
const rndPlaceholder =
  "__EXTRACT_LOADER_PLACEHOLDER__" + rndNumber() + rndNumber();

/**
 * Executes the given module's src in a fake context in order to get the
 * resulting string.
 *
 * @this LoaderContext
 * @throws Error
 * @param {string} content - the module's src
 */
function extractLoader(content) {
  this.cacheable();

  const callback = this.async();
  const dependencies = [];
  const script = new vm.Script(content, {
    filename: this.resourcePath,
    displayErrors: true
  });
  const sandbox = {
    require: (resourcePath) => {
      const absPath = path
        .resolve(path.dirname(this.resourcePath), resourcePath)
        .split("?")[0];

      // If the required file is the css-loader helper, we just require
      // it with node's require.
      // If the required file should be processed by a loader we do not
      // touch it (even if it is a .js file).
      if (/^[^!]*css-base\.js$/i.test(resourcePath)) {
        // Mark the file as dependency so webpack's watcher is working
        // for css-base.js. Other dependencies
        // are automatically added by loadModule() below
        this.addDependency(absPath);

        // eslint-disable-line import/no-dynamic-require
        return require(absPath);
      }

      dependencies.push(resourcePath);

      return rndPlaceholder + resourcePath;
    },
    module: {},
    exports: {}
  };

  sandbox.module.exports = sandbox.exports;
  script.runInNewContext(sandbox);

  Promise.all(
    dependencies.map((item) => {
      return loadModule.call(this, item);
    })
  )
    .then((res) => {
      let parsedContent = sandbox.module.exports;

      for (let i = 0; i < res.length; i++) {
        parsedContent = parsedContent.replace(
          new RegExp(rndPlaceholder + res[i].request, "g"),
          res[i].src
        );
      }

      callback(null, parsedContent);
    })
    .catch(callback);
}

/**
 * Loads the given module with webpack's internal module loader and returns
 * the source code.
 *
 * @this LoaderContext
 * @param {string} request
 * @returns {Promise<string>}
 */
function loadModule(request) {
  return new Promise((resolve, reject) => {
    this.loadModule(request, (err, src) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          src: runModule(src, request),
          request
        });
      }
    });
  });
}

/**
 * Executes the given CommonJS module in a fake context to get the exported
 * string. The given module is expected to just return a string without
 * requiring further modules.
 *
 * @throws Error
 * @param {string} src
 * @param {string} filename
 * @param {string} [publicPath]
 * @returns {string}
 */
function runModule(src, filename, publicPath = "") {
  const script = new vm.Script(src, {
    filename,
    displayErrors: true
  });
  const sandbox = {
    module: {},
    // eslint-disable-line camelcase
    __webpack_public_path__: publicPath
  };

  script.runInNewContext(sandbox);

  return sandbox.module.exports.toString();
}

export default extractLoader;
