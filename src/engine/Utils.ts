/**
 * Returns a nested property of an object given it's path.
 * Otherwise returns undefined if path doesn't exist.
 */
export function deep(obj: any, path: string): any {
  let o = JSON.parse(JSON.stringify(obj));
  let parts = path.split(".").reverse();
  let attribute = parts.pop();
  while (parts.length > 0) {
    o = o[attribute];
    attribute = parts.pop();
    if (!o) {
      return undefined;
    }
  }
  return o[attribute]
}
