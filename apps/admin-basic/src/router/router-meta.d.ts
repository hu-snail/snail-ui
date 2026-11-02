/**
 * vue-router RouteMeta augmentation.
 *
 * Lives in its own module file on purpose: an ambient `declare module` in a
 * global script *replaces* the real module types (wiping every export), while
 * in a module file it *merges* as an augmentation. The side-effect import
 * below is what makes this file a module.
 */
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** Static auth pages (login/register) skip the session guard. */
    public?: boolean;
    /** Dynamic-route meta injected from the backend menu tree. */
    i18nKey?: string;
    parentI18nKey?: string;
    icon?: string;
  }
}
