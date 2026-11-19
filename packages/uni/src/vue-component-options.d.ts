/**
 * vue module augmentation for uni-app component options.
 *
 * uni-app forwards `options` from the component definition verbatim into the
 * compiled `Component(...)` call on the mini-program ends: the MP runtime's
 * `parseComponent` extends the platform `options` with `vueOptions.options`,
 * which is what activates `virtualHost` (and `styleIsolation` / …). Vue
 * itself has no such key, so without this augmentation a defineOptions
 * object carrying it fails the excess-property check.
 *
 * Lives in its own MODULE file (the `export {}` matters): a `declare module`
 * inside a global script .d.ts would ambient-declare the module and SHADOW
 * vue's real types ("Module 'vue' has no exported member 'computed'"), while
 * a module file merges into them.
 */
export {};

declare module 'vue' {
  interface ComponentCustomOptions {
    options?: { virtualHost?: boolean };
  }
}
