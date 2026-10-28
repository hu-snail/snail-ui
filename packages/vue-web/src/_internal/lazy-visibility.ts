/**
 * useLazyVisibility — shared IntersectionObserver gate for lazy media
 * (SnImage / SnAvatar).
 *
 * naive-ui semantics (mirrored): `lazy` turns lazy loading on; when
 * `intersection-observer-options` is present the src is withheld until the
 * element reports visibility through an IntersectionObserver, otherwise the
 * native `loading="lazy"` attribute is used and no JS gate is needed.
 *
 * Gate model:
 *   - `resolved` flips to true when the target has intersected once (or when
 *     the gate cannot be built at all). It is monotonic — an image that
 *     scrolled past must not unload.
 *   - `shouldLoad = !enabled || resolved`. Disabling lazy loading therefore
 *     releases the gate immediately (the consumer falls back to the native
 *     attribute), while enabling it later gates again until visibility.
 *   - No `IntersectionObserver` in the environment → the gate resolves
 *     immediately (explicit fallback, AGENTS.md §85): the media loads eagerly
 *     instead of never loading. (The previous inline SnImage implementation
 *     silently kept the src withheld on such browsers.)
 *
 * Lifecycle:
 *   - The observer is rebuilt when the *resolved* options change (root
 *     element, rootMargin, threshold), not when the options object identity
 *     changes: a parent re-rendering with an inline options literal must not
 *     churn observers.
 *   - Disconnected on unmount (AGENTS.md §41).
 *   - `root` may be an element, a selector, or null/undefined (viewport); a
 *     `root` element that only exists after mount is picked up, because the
 *     options are re-evaluated reactively.
 */

import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

/** IntersectionObserver init subset consumers configure (same shape SnImage forwards). */
export interface LazyVisibilityOptions {
  root?: Element | Document | string | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface LazyVisibility {
  /** True once the media may load (immediately when ungated / unsupported). */
  shouldLoad: Ref<boolean>;
}

export function useLazyVisibility(
  target: Ref<Element | null>,
  options: Ref<LazyVisibilityOptions | undefined>,
  enabled: Ref<boolean>,
): LazyVisibility {
  /** Monotonic: true once the media may load (intersected, or no gate possible). */
  const resolved = ref(false);
  const shouldLoad = computed(() => !enabled.value || resolved.value);

  let observer: IntersectionObserver | null = null;
  /** Element the current observer watches — pairs with `observedOptions`. */
  let observed: Element | null = null;
  let observedOptions: LazyVisibilityOptions | undefined;

  function disconnect(): void {
    observer?.disconnect();
    observer = null;
    observed = null;
    observedOptions = undefined;
  }

  function resolveRoot(rootOption: LazyVisibilityOptions['root']): Element | Document | null {
    if (rootOption === undefined || rootOption === null) return null;
    if (typeof rootOption === 'string') {
      return typeof document !== 'undefined' ? document.querySelector(rootOption) : null;
    }
    return rootOption;
  }

  function sameThreshold(
    a: LazyVisibilityOptions['threshold'],
    b: LazyVisibilityOptions['threshold'],
  ): boolean {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((value, index) => value === b[index]);
    }
    return false;
  }

  /** Structural comparison — an inline options literal must not rebuild the observer. */
  function sameOptions(
    a: LazyVisibilityOptions | undefined,
    b: LazyVisibilityOptions | undefined,
  ): boolean {
    if (a === b) return true;
    return (
      resolveRoot(a?.root) === resolveRoot(b?.root) &&
      (a?.rootMargin ?? '') === (b?.rootMargin ?? '') &&
      sameThreshold(a?.threshold, b?.threshold)
    );
  }

  /** Build / tear down the observer so it matches the current inputs. Idempotent. */
  function syncObserver(): void {
    if (!enabled.value || resolved.value || !target.value) {
      disconnect();
      return;
    }
    if (observer && observed === target.value && sameOptions(observedOptions, options.value))
      return;
    disconnect();
    if (typeof IntersectionObserver === 'undefined') {
      // Explicit fallback (§85): no observer support → resolve the gate so the
      // media loads eagerly rather than withholding the src forever.
      resolved.value = true;
      return;
    }
    const option = options.value;
    const init: IntersectionObserverInit = {};
    if (option?.root !== undefined) init.root = resolveRoot(option.root);
    if (option?.rootMargin !== undefined) init.rootMargin = option.rootMargin;
    if (option?.threshold !== undefined) init.threshold = option.threshold;
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          resolved.value = true;
          disconnect();
          return;
        }
      }
    }, init);
    observer.observe(target.value);
    observed = target.value;
    observedOptions = option;
  }

  onMounted(syncObserver);

  watch([enabled, options, target], syncObserver, { immediate: true, flush: 'post' });

  onBeforeUnmount(disconnect);

  return { shouldLoad };
}
