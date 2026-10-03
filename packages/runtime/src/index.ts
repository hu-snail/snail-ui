/**
 * AUI Runtime — schema interpreter over Protocol + Schema + Tokens.
 *
 * Per AGENTS.md §18 Runtime MUST NOT do business work (login / order / payment
 * / CRM / ERP / database / business store / permission).
 * Per AGENTS.md §19 Phase 1 reuses @vue/reactivity via ReactiveAdapter
 * (wired in AUI-REACTIVE-001/002/003 — Sub-task 6).
 *
 *   AUI-RUNTIME-001 Runtime        (createRuntime / mount / update / unmount)
 *   AUI-RUNTIME-002 RuntimeContext (state / props / actions / registry / tokens / platform / runtime / signal)
 *   AUI-RUNTIME-003 Lifecycle      (created → mounted → updating → updated → unmounting → disposed)
 *   AUI-RUNTIME-004 Error System   (AUIError with code / path / message / hint / source / severity / cause)
 */

export const AUI_RUNTIME_VERSION = '0.1.0';

export {
  createAUIError,
  isAUIError,
  toAUIError,
  ERROR_CODE_NAMESPACE,
  type AUIError,
  type AUIErrorSeverity,
  type AUIErrorSource,
  type CreateAUIErrorInput,
} from './error.js';

export {
  type PlatformAdapter,
  type PlatformId,
  type PlatformCapabilities,
} from './platform.js';

export {
  createLifecycleTracker,
  type LifecycleTracker,
  type LifecyclePhase,
  type Disposable,
  type DisposeFn,
} from './lifecycle.js';

export {
  type RuntimeContext,
  type RuntimeLike,
  type RuntimeComponentRegistry,
  type RuntimeComponentEntry,
  type RuntimeComponentInput,
  type RuntimeComponentInstance,
  type RuntimeActionRegistry,
  type RuntimeActionHandler,
  type RuntimeActionInput,
  type TokenEnvironmentLike,
  createContextError,
} from './context.js';

export {
  createRuntime,
  type AUIRuntime,
  type CreateRuntimeInput,
  type RuntimeHooks,
} from './runtime.js';

export {
  createReactiveAdapter,
  type ReactiveAdapter,
  type ReactiveValue,
  type StopHandle,
} from './reactive.js';

export {
  compileExpression,
  evaluateExpression,
  type BindingContext,
  type CompiledExpression,
} from './expression.js';

export {
  resolveBinding,
  type ResolvedBinding,
  type BindingResolveOptions,
} from './binding.js';

export {
  matchEventBindings,
  dispatchEvent,
  resolveEventAction,
  type PlatformEventLike,
  type EventBindingDispatch,
  type EventDispatchInput,
} from './event-binding.js';

export type {
  UIBinding,
  StateBinding,
  ComputedBinding,
  PropBinding,
  EventBinding,
  ExpressionBinding,
} from './binding.js';

export {
  createActionRegistry,
  type ActionRegistry,
  type ActionHandler,
  type ActionHandlerEntry,
  type ActionContext,
  type ActionResult,
  type ActionInvokeInput,
  type CreateActionRegistryOptions,
} from './action.js';

export {
  createNoopAppBridge,
  listCapabilities,
  type AppBridge,
  type AppBridgeCapability,
  type AppBridgeLike,
  type RouterCapability,
  type StorageCapability,
  type NotifyCapability,
  type NotifyLevel,
  type AnalyticsCapability,
  type EventCapability,
} from './app-bridge.js';