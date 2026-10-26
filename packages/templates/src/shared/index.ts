/**
 * Shared layer barrel — the single import surface for both ends' templates.
 *
 * Re-exports the data contracts, the pure stream fold, the formatting helpers,
 * and the framework-neutral icon path data. Neither end's components reach
 * into the individual modules; they import from here, which keeps the split
 * between `types.ts` / `stream.ts` / `icons.ts` an internal detail.
 */

export type {
  SnAiAgent,
  SnAiAttachment,
  SnAiAttachmentPart,
  SnAiError,
  SnAiErrorPart,
  SnAiMessage,
  SnAiMessagePart,
  SnAiMessageStatus,
  SnAiModel,
  SnAiModelParams,
  SnAiPermission,
  SnAiPermissionOption,
  SnAiQueuedTurn,
  SnAiRole,
  SnAiTextPart,
  SnAiThinkingLevel,
  SnAiThinkingPart,
  SnAiToolPart,
  SnAiVendor,
} from './types';

export {
  DEFAULT_PERMISSION_OPTIONS,
  THINKING_LEVELS,
  applyStreamDelta,
  createAssistantMessage,
  createSystemMessage,
  createUserMessage,
  findErrorPart,
  findTextPart,
  findThinkingPart,
  formatBytes,
  formatContextWindow,
  formatThinkingDuration,
  isActiveStatus,
  markAborted,
  markDone,
  markError,
  nextId,
  resetIdSequence,
  thinkingBudget,
} from './stream';
export type { SnAiStreamDelta } from './stream';

export type { SnIconData } from './icons';
export {
  AgentIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  CopyIcon,
  FileIcon,
  ImageIcon,
  KeyIcon,
  ModelIcon,
  PaperclipIcon,
  ParamsIcon,
  PlusIcon,
  RetryIcon,
  SendIcon,
  ServerIcon,
  ShieldIcon,
  StopIcon,
  ThinkingIcon,
  ToolIcon,
  TrashIcon,
  UserIcon,
  WarningIcon,
} from './icons';
