/**
 * en-US locale — idiomatic English translation, same namespace structure as
 * `zh-cn.ts`. See that file for the placeholder / partial-namespace
 * conventions.
 */

import type { SnLocale } from './zh-cn'

/** Built-in English (US) locale. */
export const enUS: SnLocale = {
  name: 'en-US',
  Upload: {
    pending: 'Pending',
    uploading: 'Uploading',
    done: 'Completed',
    error: 'Failed',
    clickToUpload: 'Click to upload',
    draggerTitle: 'Click or drag files to this area to upload',
    draggerHint: 'Upload one or multiple files',
    draggerHintAccept: ', only {accept} allowed',
    inputAriaLabel: 'Choose files to upload',
    triggerAriaLabel: 'Upload files',
    draggerAriaLabel: 'Drag files here or click to upload',
    previewAriaLabel: 'Preview {name}',
    removeAriaLabel: 'Remove {name}',
    uploadingAriaLabel: 'Uploading {name}',
  },
  Log: {
    loading: 'Loading',
  },
  VideoControls: {
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    toolbar: 'Playback controls',
    timeline: 'Playback progress',
  },
  DatePicker: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    monthTitle: '{m} {y}',
    yearTitle: '{y}',
    placeholder: 'Select date',
    rangeStartPlaceholder: 'Start date',
    rangeEndPlaceholder: 'End date',
  },
  Pagination: {
    total: '{total} items',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    currentPageStatus: 'Current page, {total} pages in total',
    page: 'Page {page}',
    jumpAriaLabel: 'Page jump input, press Enter to navigate',
    perPage: 'Items per page',
    navigationAriaLabel: 'Pagination',
  },
  Calendar: {
    monthTitle: '{m} {y}',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    prevMonth: 'Previous month',
    today: 'Today',
    nextMonth: 'Next month',
    gridLabel: 'Calendar',
  },
}
