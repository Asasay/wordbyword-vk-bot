declare module "add-filename-increment" {
  export = increment;
  /**
   * The main export is a function that adds a trailing increment to
   * the `stem` (basename without extension) of the given file path or object.
   * ```js
   * console.log(increment('foo/bar.txt', { platform: 'darwin' }));
   * //=> foo/bar copy.txt
   * console.log(increment('foo/bar.txt', { platform: 'linux' }));
   * //=> foo/bar (copy).txt
   * console.log(increment('foo/bar.txt', { platform: 'win32' }));
   * //=> foo/bar (2).txt
   * ```
   * @name increment
   * @param {String|Object} `file` If the file is an object, it must have a `path` property.
   * @param {Object} `options` See [available options](#options).
   * @return {String|Object} Returns a file of the same type that was given, with an increment added to the file name.
   * @api public
   */
  declare function increment(...args: any[]): string | any;
  declare namespace increment {
    /**
     * Add a trailing increment to the given `filepath`.
     *
     * ```js
     * console.log(increment.path('foo/bar.txt', { platform: 'darwin' }));
     * //=> foo/bar copy.txt
     * console.log(increment.path('foo/bar.txt', { platform: 'linux' }));
     * //=> foo/bar (copy).txt
     * console.log(increment.path('foo/bar.txt', { platform: 'win32' }));
     * //=> foo/bar (2).txt
     * ```
     * @name .path
     * @param {String} `filepath`
     * @param {Object} `options` See [available options](#options).
     * @return {String}
     * @api public
     */
    export function path(filepath: string, options?: any): string;
    /**
     * Add a trailing increment to the `file.base` of the given file object.
     *
     * ```js
     * console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'darwin' }));
     * //=> { path: 'foo/bar copy.txt', base: 'bar copy.txt' }
     * console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'linux' }));
     * //=> { path: 'foo/bar (copy).txt', base: 'bar (copy).txt' }
     * console.log(increment.file({ path: 'foo/bar.txt' }, { platform: 'win32' }));
     * //=> { path: 'foo/bar (2).txt', base: 'bar (2).txt' }
     * ```
     * @name .file
     * @param {String|Object} `file` If passed as a string, the path will be parsed to create an object using `path.parse()`.
     * @param {Object} `options` See [available options](#options).
     * @return {Object} Returns an object.
     * @api public
     */
    export function file(file: any, options?: any): any;
    export { ordinal };
    export { toOrdinal };
  }
  declare function ordinal(n: any): string;
  declare function toOrdinal(number: any): string;
}
