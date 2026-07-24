/**
 * Returns an object according to the given dotted path.
 *
 * @param {string} path The path of the value.
 * @param {any} value The value.
 * @returns {any} An object with the value at the given path.
 */
export function createObjectFromPath(path: string, value: any): any {
  if (path.includes('.')) {
    const [root] = path.split('.', 1);
    const subpath = path.substring(path.indexOf('.') + 1);
    return { [root]: createObjectFromPath(subpath, value) };
  }

  return { [path]: value };
}
