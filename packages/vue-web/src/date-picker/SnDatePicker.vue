<template>
  <div
    ref="rootRef"
    :class="[
      'sn-date-picker',
      `sn-date-picker--${size}`,
      {
        'sn-date-picker--disabled': disabled,
        'sn-date-picker--readonly': readonly,
        'sn-date-picker--focused': isFocused,
        'sn-date-picker--active': isPanelOpen,
        [`sn-date-picker--status-${status}`]: status !== 'default',
      },
      customClass,
    ]"
    :data-snui-component="'date-picker'"
    :data-size="size"
    :data-status="status"
    :style="wrapperStyle || undefined"
  >
    <div
      class="sn-date-picker__selection"
      role="combobox"
      :aria-expanded="isPanelOpen ? 'true' : 'false'"
      aria-haspopup="grid"
      :aria-controls="isPanelOpen ? panelId : undefined"
      :aria-activedescendant="activeDescendant ?? undefined"
      :aria-label="ariaLabel || 'Date picker'"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="isInteractive ? 0 : -1"
      @mousedown="onTriggerMouseDown"
      @click="onTriggerClick"
      @keydown="onTriggerKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template v-if="isRange">
        <span v-if="rangeStartText !== null" class="sn-date-picker__value">{{
          rangeStartText
        }}</span>
        <span v-else class="sn-date-picker__placeholder">{{ rangePlaceholders[0] }}</span>
        <span class="sn-date-picker__separator" aria-hidden="true">{{ locale.DatePicker.to }}</span>
        <span v-if="rangeEndText !== null" class="sn-date-picker__value">{{ rangeEndText }}</span>
        <span v-else class="sn-date-picker__placeholder">{{ rangePlaceholders[1] }}</span>
      </template>
      <template v-else>
        <span v-if="singleText !== null" class="sn-date-picker__value">{{ singleText }}</span>
        <span v-else class="sn-date-picker__placeholder">{{ singlePlaceholder }}</span>
      </template>
    </div>

    <!-- Suffix area: clear button | arrow -->
    <div class="sn-date-picker__suffix">
      <button
        v-if="clearable && hasValue && isInteractive"
        type="button"
        class="sn-date-picker__clear"
        aria-label="Clear date"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearValue"
      >
        <SnIcon :icon="CloseIcon" :size="11" />
      </button>
      <span
        v-else
        class="sn-date-picker__arrow"
        :class="{ 'sn-date-picker__arrow--up': isPanelOpen }"
        aria-hidden="true"
      >
        <SnIcon :icon="ChevronDownIcon" :size="13" />
      </span>
    </div>

    <!-- Date panel — teleported to body -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isPanelOpen"
          :id="panelId"
          ref="panelRef"
          :class="[
            'sn-date-picker-panel',
            `sn-date-picker-panel--${placement}`,
            {
              'sn-date-picker-panel--range': isRange,
              'sn-date-picker-panel--month-range': isMonthRange,
            },
          ]"
          :style="panelStyle"
          role="group"
          :aria-label="ariaLabel || 'Date picker panel'"
          @mousedown.prevent
        >
          <div class="sn-date-picker-panel__layout">
            <div
              v-if="sideShortcuts.length > 0"
              class="sn-date-picker-panel__shortcuts sn-date-picker-panel__shortcuts--side"
            >
              <button
                v-for="sc in sideShortcuts"
                :key="sc.label"
                type="button"
                class="sn-date-picker-panel__shortcut"
                :tabindex="-1"
                @click="onShortcutClick(sc)"
              >
                {{ sc.label }}
              </button>
            </div>
            <div
              class="sn-date-picker-panel__body"
              :class="{ 'sn-date-picker-panel__body--inputs-bottom': isInputBottom }"
            >
              <!-- Datetime range: 4 header fields (start date / start time |
                   end date / end time). Clicking a time field opens the
                   hour/minute/second popover below it. -->
              <div
                v-if="isDatetimeRange"
                class="sn-date-picker-panel__inputs"
                :class="{ 'sn-date-picker-panel__inputs--bottom': isInputBottom }"
              >
                <div class="sn-date-picker-panel__input-pair">
                  <input
                    class="sn-date-picker-field"
                    type="text"
                    readonly
                    :value="rangeInputDateText('start')"
                    :placeholder="datePickerLocale.rangeStartPlaceholder"
                    :aria-label="datePickerLocale.rangeStartPlaceholder"
                  />
                  <input
                    class="sn-date-picker-field sn-date-picker-field--time"
                    :class="{ 'sn-date-picker-field--active': timePopoverSide === 'start' }"
                    type="text"
                    readonly
                    :value="rangeInputTimeText('start')"
                    placeholder="HH:mm:ss"
                    :aria-label="datePickerLocale.startTime"
                    @click="openTimePopover('start')"
                  />
                </div>
                <span class="sn-date-picker-panel__input-divider" aria-hidden="true" />
                <div class="sn-date-picker-panel__input-pair">
                  <input
                    class="sn-date-picker-field"
                    type="text"
                    readonly
                    :value="rangeInputDateText('end')"
                    :placeholder="datePickerLocale.rangeEndPlaceholder"
                    :aria-label="datePickerLocale.rangeEndPlaceholder"
                  />
                  <input
                    class="sn-date-picker-field sn-date-picker-field--time"
                    :class="{ 'sn-date-picker-field--active': timePopoverSide === 'end' }"
                    type="text"
                    readonly
                    :value="rangeInputTimeText('end')"
                    placeholder="HH:mm:ss"
                    :aria-label="datePickerLocale.endTime"
                    @click="openTimePopover('end')"
                  />
                </div>

                <!-- Time popover — overlays the dual calendars -->
                <div
                  v-if="timePopoverSide !== null"
                  class="sn-date-picker-time-popover"
                  :class="`sn-date-picker-time-popover--${timePopoverSide}`"
                  role="group"
                  :aria-label="datePickerLocale.selectTime"
                >
                  <div class="sn-date-picker-time-group">
                    <div class="sn-date-picker-time-popover__current">
                      <span v-for="col in timeColumns" :key="col.key">{{
                        pad2(popoverTimeDraft[col.key])
                      }}</span>
                    </div>
                    <div class="sn-date-picker-panel__time sn-date-picker-panel__time--popover">
                      <div
                        v-for="col in timeColumns"
                        :key="col.key"
                        class="sn-date-picker-time-col"
                        role="listbox"
                        :aria-label="datePickerLocale[col.key]"
                      >
                        <div
                          v-for="v in col.values"
                          :key="v"
                          class="sn-date-picker-time-item"
                          :class="{
                            'sn-date-picker-time-item--selected': popoverTimeDraft[col.key] === v,
                          }"
                          role="option"
                          :aria-selected="popoverTimeDraft[col.key] === v ? 'true' : 'false'"
                          :data-unit="col.key"
                          :data-value="v"
                          @click="onPopoverTimeCellClick(col.key, v)"
                        >
                          {{ pad2(v) }}
                        </div>
                      </div>
                    </div>
                    <div class="sn-date-picker-time-popover__footer">
                      <button
                        type="button"
                        class="sn-date-picker-time-popover__now"
                        :tabindex="-1"
                        @click="setCurrentTime"
                      >
                        {{ datePickerLocale.now }}
                      </button>
                      <button
                        type="button"
                        class="sn-date-picker-panel__confirm"
                        :tabindex="-1"
                        @click="closeTimePopover"
                      >
                        {{ datePickerLocale.confirm }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Month range: two year | month panes (start / end) -->
              <div
                v-if="isMonthRange"
                class="sn-date-picker-panel__months"
                role="group"
                :aria-label="datePickerLocale.monthRangeLabel"
              >
                <div v-for="pane in monthPanes" :key="pane.side" class="sn-date-picker-month-pane">
                  <div class="sn-date-picker-month-pane__header">
                    <div class="sn-date-picker-month-pane__current">{{ pane.year }}</div>
                    <div class="sn-date-picker-month-pane__current">{{ pane.month + 1 }}</div>
                  </div>
                  <div class="sn-date-picker-month-pane__body">
                    <div
                      class="sn-date-picker-month-pane__col"
                      role="listbox"
                      :aria-label="datePickerLocale.yearColumnLabel"
                    >
                      <div
                        v-for="y in pane.years"
                        :key="y"
                        class="sn-date-picker-month-cell"
                        :class="{
                          'sn-date-picker-month-cell--current': y === pane.year,
                        }"
                        role="option"
                        :aria-selected="y === pane.year ? 'true' : 'false'"
                        :data-year="y"
                        @click="onMonthPaneYearClick(pane.side, y)"
                      >
                        {{ y }}
                      </div>
                    </div>
                    <div
                      class="sn-date-picker-month-pane__col"
                      role="listbox"
                      :aria-label="datePickerLocale.monthColumnLabel"
                    >
                      <div
                        v-for="m in 12"
                        :key="m"
                        class="sn-date-picker-month-cell"
                        :class="[
                          monthCellClasses(pane.side, m - 1),
                          { 'sn-date-picker-month-cell--current': m - 1 === pane.month },
                        ]"
                        role="option"
                        :aria-selected="monthCellSelected(pane.side, m - 1) ? 'true' : 'false'"
                        :aria-disabled="
                          isMonthCellDisabled(monthCellTs(pane.side, m - 1)) ? 'true' : undefined
                        "
                        :data-side="pane.side"
                        :data-month="m - 1"
                        @click="onMonthPaneMonthClick(pane.side, m - 1)"
                        @mouseenter="onMonthPaneHover(pane.side, m - 1)"
                      >
                        {{ m }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="sn-date-picker-panel__calendars">
                <template v-for="(cal, calIndex) in calendars" :key="cal.key">
                  <div class="sn-date-picker-calendar">
                    <div class="sn-date-picker-calendar__header">
                      <button
                        type="button"
                        class="sn-date-picker-nav"
                        :aria-label="`Previous ${navUnitLabel}s`"
                        :tabindex="-1"
                        @click="shiftAnchor(-navBigStep)"
                      >
                        <SnIcon :icon="DoubleChevronLeftIcon" :size="12" />
                      </button>
                      <button
                        type="button"
                        class="sn-date-picker-nav"
                        :aria-label="`Previous ${navUnitLabel}`"
                        :tabindex="-1"
                        @click="shiftAnchor(-1)"
                      >
                        <SnIcon :icon="ChevronLeftIcon" :size="12" />
                      </button>
                      <button
                        type="button"
                        class="sn-date-picker-calendar__title"
                        :tabindex="-1"
                        @click="onTitleClick"
                      >
                        {{ headerTitleOf(cal) }}
                      </button>
                      <button
                        type="button"
                        class="sn-date-picker-nav"
                        :aria-label="`Next ${navUnitLabel}`"
                        :tabindex="-1"
                        @click="shiftAnchor(1)"
                      >
                        <SnIcon :icon="ChevronRightIcon" :size="12" />
                      </button>
                      <button
                        type="button"
                        class="sn-date-picker-nav"
                        :aria-label="`Next ${navUnitLabel}s`"
                        :tabindex="-1"
                        @click="shiftAnchor(navBigStep)"
                      >
                        <SnIcon :icon="DoubleChevronRightIcon" :size="12" />
                      </button>
                    </div>

                    <!-- Day view -->
                    <div
                      v-if="viewMode === 'day'"
                      class="sn-date-picker-grid"
                      role="grid"
                      :aria-label="cal.title"
                    >
                      <div class="sn-date-picker-grid__row" role="row">
                        <span
                          v-for="wd in datePickerLocale.weekdays"
                          :key="wd"
                          class="sn-date-picker-grid__weekday"
                          role="columnheader"
                          >{{ wd }}</span
                        >
                      </div>
                      <div
                        v-for="(row, ri) in cal.monthGrid"
                        :key="ri"
                        class="sn-date-picker-grid__row"
                        role="row"
                      >
                        <div
                          v-for="cell in row"
                          :key="cell.ts"
                          :id="cellId(cell.ts)"
                          class="sn-date-picker-cell"
                          :class="{
                            'sn-date-picker-cell--other-month': !cell.isCurrentMonth,
                            'sn-date-picker-cell--selected': isCellSelected(cell.ts),
                            'sn-date-picker-cell--start': isCellStart(cell.ts),
                            'sn-date-picker-cell--end': isCellEnd(cell.ts),
                            'sn-date-picker-cell--in-range': isCellInRange(cell.ts),
                            'sn-date-picker-cell--cursor':
                              cursor !== null && cell.ts === startOfDay(cursor),
                            'sn-date-picker-cell--disabled': isCellDisabled(cell.ts),
                          }"
                          role="gridcell"
                          :aria-selected="
                            isCellSelected(cell.ts) || isCellStart(cell.ts) || isCellEnd(cell.ts)
                              ? 'true'
                              : 'false'
                          "
                          :aria-disabled="isCellDisabled(cell.ts) ? 'true' : undefined"
                          :data-value="cell.ts"
                          @click="onDayCellClick(cell.ts)"
                          @mouseenter="onDayCellHover(cell.ts)"
                        >
                          {{ cell.day }}
                        </div>
                      </div>
                    </div>

                    <!-- Quarter view (quarter types commit; date modes: nav drill) -->
                    <div
                      v-else-if="viewMode === 'quarter'"
                      class="sn-date-picker-grid sn-date-picker-grid--unit sn-date-picker-grid--quarter"
                      role="grid"
                      :aria-label="cal.yearTitle"
                    >
                      <div
                        v-for="(row, ri) in cal.quarterUnitRows"
                        :key="ri"
                        class="sn-date-picker-grid__row"
                        role="row"
                      >
                        <div
                          v-for="cell in row"
                          :key="cell.value"
                          :id="unitCellId(cal.key, 'q', cell.value)"
                          class="sn-date-picker-cell sn-date-picker-cell--unit"
                          :class="{
                            'sn-date-picker-cell--selected': isQuarterCellSelected(
                              cell.ts,
                              cal.year,
                            ),
                            'sn-date-picker-cell--start': isQuarterCellStart(cell.ts),
                            'sn-date-picker-cell--end': isQuarterCellEnd(cell.ts),
                            'sn-date-picker-cell--in-range': isQuarterCellInRange(cell.ts),
                            'sn-date-picker-cell--cursor': isQuarterCellCursor(cell.ts, cal.year),
                            'sn-date-picker-cell--disabled': isQuarterCellDisabled(cell.ts),
                          }"
                          role="gridcell"
                          :aria-selected="
                            isQuarterCellSelected(cell.ts, cal.year) ? 'true' : 'false'
                          "
                          :aria-disabled="isQuarterCellDisabled(cell.ts) ? 'true' : undefined"
                          :data-value="cell.value"
                          @click="onQuarterCellClick(cell.ts)"
                        >
                          {{ cell.label }}
                        </div>
                      </div>
                    </div>

                    <!-- Month-of-year view -->
                    <div
                      v-else-if="viewMode === 'month'"
                      class="sn-date-picker-grid sn-date-picker-grid--unit sn-date-picker-grid--month"
                      role="grid"
                      :aria-label="cal.yearTitle"
                    >
                      <div
                        v-for="(row, ri) in cal.monthUnitRows"
                        :key="ri"
                        class="sn-date-picker-grid__row"
                        role="row"
                      >
                        <div
                          v-for="cell in row"
                          :key="cell.value"
                          :id="unitCellId(cal.key, 'm', cell.value)"
                          class="sn-date-picker-cell sn-date-picker-cell--unit"
                          :class="{
                            'sn-date-picker-cell--selected': isMonthCellSelected(cell.ts, cal.year),
                            'sn-date-picker-cell--cursor': isMonthCellCursor(cell.ts, cal.year),
                            'sn-date-picker-cell--disabled': isMonthCellDisabled(cell.ts),
                          }"
                          role="gridcell"
                          :aria-selected="isMonthCellSelected(cell.ts, cal.year) ? 'true' : 'false'"
                          :aria-disabled="isMonthCellDisabled(cell.ts) ? 'true' : undefined"
                          :data-value="cell.value"
                          @click="onMonthCellClick(cell.ts)"
                        >
                          {{ cell.label }}
                        </div>
                      </div>
                    </div>

                    <!-- Year view -->
                    <div
                      v-else
                      class="sn-date-picker-grid sn-date-picker-grid--unit sn-date-picker-grid--year"
                      role="grid"
                      :aria-label="cal.decadeTitle"
                    >
                      <div
                        v-for="(row, ri) in cal.yearUnitRows"
                        :key="ri"
                        class="sn-date-picker-grid__row"
                        role="row"
                      >
                        <div
                          v-for="cell in row"
                          :key="cell.value"
                          :id="unitCellId(cal.key, 'y', cell.value)"
                          class="sn-date-picker-cell sn-date-picker-cell--unit"
                          :class="{
                            'sn-date-picker-cell--selected': isYearCellSelected(cell.ts),
                            'sn-date-picker-cell--cursor': isYearCellCursor(cell.ts),
                            'sn-date-picker-cell--disabled': isYearCellDisabled(cell.ts),
                          }"
                          role="gridcell"
                          :aria-selected="isYearCellSelected(cell.ts) ? 'true' : 'false'"
                          :aria-disabled="isYearCellDisabled(cell.ts) ? 'true' : undefined"
                          :data-value="cell.value"
                          @click="onYearCellClick(cell.ts)"
                        >
                          {{ cell.label }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Aside time columns — single datetime only (range mode
                       uses the header input row + time popover instead). -->
                  <div
                    v-if="hasTime && !isRange"
                    class="sn-date-picker-panel__time sn-date-picker-panel__time--aside"
                  >
                    <div class="sn-date-picker-time-group">
                      <div v-if="!isRange" class="sn-date-picker-time-group__label">
                        {{ locale.DatePicker.selectTime }}
                      </div>
                      <div class="sn-date-picker-panel__time">
                        <div
                          v-for="col in timeColumns"
                          :key="col.key"
                          class="sn-date-picker-time-col"
                          role="listbox"
                          :aria-label="timeGroupAriaLabel(calIndex, col.key)"
                        >
                          <div
                            v-for="v in col.values"
                            :key="v"
                            class="sn-date-picker-time-item"
                            :class="{
                              'sn-date-picker-time-item--selected':
                                timeDraftFor(calIndex)[col.key] === v,
                            }"
                            role="option"
                            :aria-selected="
                              timeDraftFor(calIndex)[col.key] === v ? 'true' : 'false'
                            "
                            :data-unit="col.key"
                            :data-value="v"
                            @click="onTimeCellClick(sideOf(calIndex), col.key, v)"
                          >
                            {{ pad2(v) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <div
                v-if="bottomShortcuts.length > 0"
                class="sn-date-picker-panel__shortcuts sn-date-picker-panel__shortcuts--bottom"
              >
                <button
                  v-for="sc in bottomShortcuts"
                  :key="sc.label"
                  type="button"
                  class="sn-date-picker-panel__shortcut"
                  :tabindex="-1"
                  @click="onShortcutClick(sc)"
                >
                  {{ sc.label }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="hasTime || showTodayFooter || isMonthRange"
            class="sn-date-picker-panel__footer"
          >
            <button
              v-if="showTodayFooter"
              type="button"
              class="sn-date-picker-panel__today"
              :tabindex="-1"
              @click="jumpToday"
            >
              {{ locale.DatePicker.today }}
            </button>
            <button
              v-if="isDatetimeRange || isMonthRange"
              type="button"
              class="sn-date-picker-panel__clear"
              :tabindex="-1"
              @click="clearPanelDraft"
            >
              {{ locale.DatePicker.clear }}
            </button>
            <button
              v-if="hasTime || isMonthRange"
              type="button"
              class="sn-date-picker-panel__confirm"
              :tabindex="-1"
              @click="confirmAndClose"
            >
              {{ locale.DatePicker.confirm }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnDatePicker — web-end date picker component.
 *
 * Reference library: naive-ui `n-date-picker`
 *   (https://www.naiveui.com/zh-CN/light/components/date-picker)
 *
 * Parity (this version):
 *   - type: 'date' | 'datetime' | 'week' | 'quarter' | 'month' | 'year' |
 *     'daterange' | 'datetimerange' | 'weekrange' | 'quarterrange' |
 *     'monthrange'. Range types bind `[start, end]` timestamps.
 *   - modelValue: millisecond timestamps, local timezone (Date convention).
 *     Week values are the week's Monday midnight; quarter values the
 *     quarter's first midnight.
 *   - format: lowercase tokens yyyy/yy/MM/M/dd/d/HH/mm/m/ss/s plus
 *     w/ww (ISO week) and q/qq (quarter). 'yyyy' stays the CALENDAR year —
 *     week formats at Dec/Jan boundaries may diverge from the ISO week-year.
 *   - placeholder (string, or [start, end] pair in range modes) /
 *     clearable / disabled / readonly / size / status.
 *   - disabledDate: predicate over local-midnight timestamps; disabled
 *     cells render dimmed, carry aria-disabled and refuse picks (period
 *     cells disable via their period start; week picks via their Monday).
 *   - shortcuts + shortcutsPosition ('left' | 'right' | 'bottom'): quick
 *     picks rendered beside or under the panel body; lazy values resolve
 *     at click time. inputPosition ('top' | 'bottom'): datetime-range
 *     four-field input bar placement.
 *   - select event: fires per pick with the draft value (range: the
 *     provisional start, then the sorted pair) — pair with disabledDate
 *     for dynamic range constraints.
 *   - panel: Teleport + viewport flip; Monday-first month grid with
 *     adjacent-month cells; quarter / month / year navigation grids (click
 *     the panel title to drill down — navigation-only in date modes,
 *     committing in week / quarter / month / year types).
 *   - datetime: aside time columns RIGHT of the calendar (选择时间 header,
 *     single mode only). datetimerange instead uses a four-field header row
 *     (start date / start time | end date / end time) — clicking a time field
 *     opens an hour/minute/second popover with 此刻 / 确认. Both time modes
 *     show a 确认 footer; range time modes also show 清除.
 *   - monthrange: two side-by-side year | month panes with range highlight,
 *     auto swap, 清除 / 确认 footer and month-step keyboard navigation.
 *   - range: two side-by-side calendars, start-then-end selection with
 *     automatic swap when end < start, selected interval highlighted.
 *   - keyboard: Arrow keys move the cursor, PageUp/PageDown page by the
 *     header unit, Enter picks/confirms, Escape closes (simplified).
 *   - events: update:modelValue, change, select, clear, focus, blur.
 *   - a11y: combobox trigger + role=grid/gridcell panels with
 *     aria-selected and aria-activedescendant.
 *
 * Not ported (out of scope, see ai-description.md): dual-panel month/year
 * quick jump, actions bar, formatted-value / value-format, disabledTime,
 * i18n beyond zh-CN strings.
 *
 * Per AGENTS.md §30/31: props / events / tokens / accessibility are
 * declared below; CSS uses `--sn-web-date-picker-*` aliases with
 * `--sn-web-color-*` fallbacks only.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { useOverlayFollow } from '../_internal/use-overlay-follow';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from './sn-date-picker-icons';
import { useLocale } from '../locales/use-locale';
import {
  DEFAULT_FORMATS,
  addMonths,
  addYears,
  buildDate,
  buildMonthGrid,
  buildMonthUnitGrid,
  buildQuarterUnitGrid,
  buildYearUnitGrid,
  combineDateTime,
  formatDecadeTitle,
  formatDate,
  getDateParts,
  getQuarter,
  hasTimePart,
  isQuarterType,
  isRangeType,
  isMonthRangeType,
  isSameDay,
  isSameMonth,
  isSameQuarter,
  isSameWeek,
  isSameYear,
  isWeekType,
  pad2,
  rangeInclusive,
  startOfDay,
  startOfQuarter,
  startOfWeek,
  type SnDatePickerShortcut,
  type SnDatePickerShortcutsPosition,
  type SnDatePickerInputPosition,
  type SnDateRangeValue,
  type SnDatePickerSize,
  type SnDatePickerStatus,
  type SnDatePickerType,
  type SnUnitGridCell,
} from './sn-date-picker-types';

defineOptions({ name: 'SnDatePicker' });

const props = withDefaults(
  defineProps<{
    /** Bound value: timestamp (single) | [start, end] (range) | null. */
    modelValue?: number | [number, number] | null;
    /** Panel / value mode. */
    type?: SnDatePickerType;
    /** Display format — lowercase tokens (yyyy MM dd HH mm ss). */
    format?: string;
    /** Placeholder; `[start, end]` pair in range modes. */
    placeholder?: string | [string, string];
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean;
    /** Visual size preset. */
    size?: SnDatePickerSize;
    /** Validation-driven visual status. */
    status?: SnDatePickerStatus;
    /**
     * Disable predicate — receives the local-midnight timestamp of each day
     * cell (and the period start for month / quarter / year cells). Disabled
     * cells render dimmed, carry `aria-disabled`, and refuse picks.
     */
    disabledDate?: (ts: number) => boolean;
    /**
     * Quick-pick entries rendered inside the panel. `value` may be a lazy
     * getter — it is resolved at click time.
     */
    shortcuts?: SnDatePickerShortcut[];
    /** Where the shortcuts bar renders. */
    shortcutsPosition?: SnDatePickerShortcutsPosition;
    /**
     * Where the four-field input bar renders in `datetimerange` panels.
     * `bottom` places it under the calendars (the time popover opens upward).
     */
    inputPosition?: SnDatePickerInputPosition;
    /** Accessible name for the trigger (fallback: 'Date picker'). */
    ariaLabel?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    modelValue: null,
    type: 'date',
    format: '',
    clearable: false,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    ariaLabel: '',
    shortcutsPosition: 'bottom',
    inputPosition: 'top',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — fires on any commit. */
  (e: 'update:modelValue', value: number | [number, number] | null): void;
  /** Value committed (also fires for clear). */
  (e: 'change', value: number | [number, number] | null): void;
  /**
   * A cell was picked in the panel (before/without the final commit) —
   * single modes emit the draft value; range modes emit the provisional
   * start after the first pick and the sorted pair after the second. Pair
   * with `disabledDate` to constrain the second end dynamically.
   */
  (e: 'select', value: number | [number, number] | null): void;
  /** Value cleared via the × button. */
  (e: 'clear'): void;
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void;
}>();

/* ─────────── Local view model ─────────── */

/** Keyboard cursor highlight unit. */
type SnTimeUnit = 'hour' | 'minute' | 'second';
type SnTimeOfDay = Record<SnTimeUnit, number>;
type SnRangeSide = 'start' | 'end';

/** Panel grid view — 'day' for date grids, 'quarter'/'month'/'year' drill-downs. */
type SnViewMode = 'day' | 'quarter' | 'month' | 'year';

/** Map a calendar index to its range side (single modes use 'start'). */
function sideOf(calIndex: number): SnRangeSide {
  return calIndex === 0 ? 'start' : 'end';
}

/** Active DatePicker locale namespace (naive-ui i18n). */
/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();
/** Active DatePicker locale namespace (naive-ui i18n). */
const datePickerLocale = computed(() => locale.value.DatePicker);
/** Module-level counter so every instance owns unique DOM ids. */
let datePickerInstanceSeed = 0;
const instanceId = ++datePickerInstanceSeed;
const panelId = `sn-date-picker-panel-${instanceId}`;

function cellId(ts: number): string {
  return `sn-date-picker-cell-${instanceId}-${ts}`;
}

function unitCellId(calKey: string, kind: 'q' | 'm' | 'y', value: number): string {
  return `sn-date-picker-unit-${instanceId}-${calKey}-${kind}-${value}`;
}

/* ─────────── State ─────────── */

const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const isPanelOpen = ref(false);
const isFocused = ref(false);
const viewMode = ref<SnViewMode>('day');
/** Anchor timestamp of the left calendar (any instant inside its month). */
const anchorTs = ref<number>(Date.now());
/** Keyboard cursor — the highlighted date / month / year. */
const cursor = ref<number>(Date.now());
/** Single-mode pending day (local midnight). */
const dateDraft = ref<number | null>(null);
/** Single-mode pending time-of-day. */
const timeDraft = ref<SnTimeOfDay>({ hour: 0, minute: 0, second: 0 });
/** Range-mode pending days (local midnights). */
const rangeDraft = ref<{ start: number | null; end: number | null }>({ start: null, end: null });
/** Range-mode pending time-of-day per side. */
const rangeTimeDraft = ref<{ start: SnTimeOfDay; end: SnTimeOfDay }>({
  start: { hour: 0, minute: 0, second: 0 },
  end: { hour: 0, minute: 0, second: 0 },
});
/**
 * Range-mode hover preview: while the end date is being picked, the cell
 * under the pointer becomes the provisional end so the in-range light
 * background tracks the mouse live (reference UX). Cleared on commit,
 * fresh pick, panel close, and external model changes.
 */
const rangeHoverEnd = ref<number | null>(null);

const isRange = computed(() => isRangeType(props.type));
const hasTime = computed(() => hasTimePart(props.type));
const isWeek = computed(() => isWeekType(props.type));
const isQuarter = computed(() => isQuarterType(props.type));
const isDatetimeRange = computed(() => props.type === 'datetimerange');
const isMonthRange = computed(() => isMonthRangeType(props.type));
/** Bottom-placed datetime-range input bar (time popover opens upward). */
const isInputBottom = computed(() => isDatetimeRange.value && props.inputPosition === 'bottom');
const isInteractive = computed(() => !props.disabled && !props.readonly);
const resolvedFormat = computed(() => props.format || DEFAULT_FORMATS[props.type]);

/**
 * Datetime-range time popover: which side's time field opened it. Kept in
 * the panel (not teleported) so it overlays the dual calendars like the
 * reference design instead of stealing width from them.
 */
const timePopoverSide = ref<SnRangeSide | null>(null);

/** Draft time-of-day shown/edited by the open popover. */
const popoverTimeDraft = computed<SnTimeOfDay>(() =>
  timePopoverSide.value === null
    ? { hour: 0, minute: 0, second: 0 }
    : rangeTimeDraft.value[timePopoverSide.value],
);

/** Year shown by each month-range pane (left = start, right = end). */
const monthPaneYear = ref<{ start: number; end: number }>(defaultMonthPaneYears());

/** Hover preview while picking the month-range end. */
const monthHoverEnd = ref<number | null>(null);

function defaultMonthPaneYears(): { start: number; end: number } {
  const year = getDateParts(Date.now()).year;
  return { start: year, end: year + 1 };
}

/** Shortcuts split by render position. */
const sideShortcuts = computed(() =>
  props.shortcutsPosition === 'bottom' ? [] : (props.shortcuts ?? []),
);
const bottomShortcuts = computed(() =>
  props.shortcutsPosition === 'bottom' ? (props.shortcuts ?? []) : [],
);

/** The 今天 footer jump (plain date picking only). */
const showTodayFooter = computed(() => props.type === 'date');

/** Per-calendar time draft (single: the one draft; range: per side). */
function timeDraftFor(calIndex: number): SnTimeOfDay {
  return isRange.value ? rangeTimeDraft.value[sideOf(calIndex)] : timeDraft.value;
}

/** Aside time-column `aria-label` (visible label only in single mode). */
function timeGroupAriaLabel(calIndex: number, unit: SnTimeUnit): string {
  const unitLabel = datePickerLocale.value[unit];
  if (!isRange.value) return `${datePickerLocale.value.selectTime} ${unitLabel}`;
  const sideLabel =
    sideOf(calIndex) === 'start'
      ? datePickerLocale.value.startTime
      : datePickerLocale.value.endTime;
  return `${sideLabel} ${unitLabel}`;
}

/** Normalized single value (null in range modes). */
const singleModel = computed<number | null>(() => {
  if (isRange.value) return null;
  return typeof props.modelValue === 'number' ? props.modelValue : null;
});

/** Normalized range value (null in single modes). */
const rangeModel = computed<SnDateRangeValue>(() => {
  if (!isRange.value) return null;
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    return [props.modelValue[0], props.modelValue[1]];
  }
  return null;
});

const hasValue = computed(() => singleModel.value !== null || rangeModel.value !== null);

/* ─────────── Display ─────────── */

const singlePlaceholder = computed(() =>
  typeof props.placeholder === 'string' && props.placeholder !== ''
    ? props.placeholder
    : datePickerLocale.value.placeholder,
);

const rangePlaceholders = computed<readonly [string, string]>(() => {
  if (Array.isArray(props.placeholder) && props.placeholder.length === 2) {
    return [props.placeholder[0], props.placeholder[1]];
  }
  if (isMonthRange.value) {
    return [
      datePickerLocale.value.monthRangeStartPlaceholder,
      datePickerLocale.value.monthRangeEndPlaceholder,
    ];
  }
  return [datePickerLocale.value.rangeStartPlaceholder, datePickerLocale.value.rangeEndPlaceholder];
});

/** Fixed panel-field date format (the trigger still honours `format`). */
const PANEL_DATE_FORMAT = 'yyyy-MM-dd';

/** Header date field text for a datetime-range side ('' until a date exists). */
function rangeInputDateText(side: SnRangeSide): string {
  const draft = side === 'start' ? rangeDraft.value.start : rangeDraft.value.end;
  const model = rangeModel.value?.[side === 'start' ? 0 : 1] ?? null;
  const ts = draft ?? model;
  return ts === null ? '' : formatDate(ts, PANEL_DATE_FORMAT);
}

/** Header time field text for a datetime-range side (pending time-of-day). */
function rangeInputTimeText(side: SnRangeSide): string {
  const t = rangeTimeDraft.value[side];
  return `${pad2(t.hour)}:${pad2(t.minute)}:${pad2(t.second)}`;
}

const singleText = computed<string | null>(() =>
  singleModel.value === null ? null : formatDate(singleModel.value, resolvedFormat.value),
);

const rangeStartText = computed<string | null>(() => {
  const v = rangeModel.value;
  if (v === null)
    return rangeDraft.value.start !== null && isPanelOpen.value
      ? formatDate(rangeDraft.value.start, resolvedFormat.value)
      : null;
  return formatDate(v[0], resolvedFormat.value);
});

const rangeEndText = computed<string | null>(() => {
  const v = rangeModel.value;
  if (v === null)
    return rangeDraft.value.end !== null && isPanelOpen.value
      ? formatDate(rangeDraft.value.end, resolvedFormat.value)
      : null;
  return formatDate(v[1], resolvedFormat.value);
});

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

/* ─────────── Calendar model ─────────── */

interface SnCalendarViewModel {
  key: string;
  year: number;
  month: number;
  title: string;
  yearTitle: string;
  decadeTitle: string;
  monthGrid: ReturnType<typeof buildMonthGrid>;
  quarterUnitRows: SnUnitGridCell[][];
  monthUnitRows: SnUnitGridCell[][];
  yearUnitRows: SnUnitGridCell[][];
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function calendarOf(anchor: number, key: string): SnCalendarViewModel {
  const p = getDateParts(anchor);
  return {
    key,
    year: p.year,
    month: p.month,
    title: datePickerLocale.value.monthTitle
      .replace('{y}', String(p.year))
      .replace('{m}', String(p.month + 1)),
    yearTitle: datePickerLocale.value.yearTitle.replace('{y}', String(p.year)),
    decadeTitle: formatDecadeTitle(p.year),
    monthGrid: buildMonthGrid(p.year, p.month),
    quarterUnitRows: chunk(
      buildQuarterUnitGrid(p.year, (q) =>
        datePickerLocale.value.quarterLabel.replace('{q}', String(q)),
      ),
      2,
    ),
    monthUnitRows: chunk(
      buildMonthUnitGrid(p.year).map((c) => ({
        ...c,
        label: datePickerLocale.value.months[c.value] ?? c.label,
      })),
      4,
    ),
    yearUnitRows: chunk(buildYearUnitGrid(p.year), 4),
  };
}

/**
 * Anchor of the right-hand calendar.
 *
 * Range panels show the range END when it lies after the left anchor (the
 * reference behaviour: start month | end month for a wide range), otherwise
 * step one unit from the left anchor so an empty panel still shows the
 * adjacent month / year. Only committed or drafted picks count — the hover
 * preview must not drag the calendar around.
 */
function secondAnchor(): number {
  const left = anchorTs.value;
  const stepped = viewMode.value === 'quarter' ? addYears(left, 1) : addMonths(left, 1);
  if (!isRange.value) return stepped;
  const draft = rangeDraft.value;
  const end =
    draft.start !== null && draft.end !== null ? draft.end : (rangeModel.value?.[1] ?? null);
  if (end === null) return stepped;
  const unitOf = viewMode.value === 'quarter' ? startOfQuarter : startOfMonthTs;
  return unitOf(end) > unitOf(left) ? end : stepped;
}

const calendars = computed<SnCalendarViewModel[]>(() => {
  if (isRange.value) {
    // Quarter view steps one YEAR per calendar; every other view one month.
    return [calendarOf(anchorTs.value, 'a'), calendarOf(secondAnchor(), 'b')];
  }
  return [calendarOf(anchorTs.value, 'a')];
});

/**
 * Header title follows the active unit: month for the day grid, year for the
 * quarter / month-of-year grids, decade window for the year grid. Showing the
 * month title on quarter grids made the quarter panel look like a date panel
 * and mislabelled its year-based navigation.
 */
function headerTitleOf(cal: SnCalendarViewModel): string {
  if (viewMode.value === 'day') return cal.title;
  if (viewMode.value === 'year') return cal.decadeTitle;
  return cal.yearTitle;
}

/** Header step unit label (a11y for the nav buttons). */
const navUnitLabel = computed(() =>
  viewMode.value === 'day' ? 'month' : viewMode.value === 'year' ? 'decade' : 'year',
);

/**
 * Big step expressed in *small steps* of the active view:
 * day = 12 months (1 year), unit views = 10 small steps (10 years / 100
 * years). Previously a flat 120 was multiplied by 12 again in shiftAnchor,
 * which jumped 120 years from a quarter / month / year grid.
 */
const navBigStep = computed(() => (viewMode.value === 'day' ? 12 : 10));

/* ─────────── Disabled predicate ─────────── */

/** Whether a day cell is blocked by `disabledDate` (local-midnight arg). */
function isCellDisabled(ts: number): boolean {
  return props.disabledDate?.(startOfDay(ts)) === true;
}

/** Week picks are blocked when their Monday is disabled. */
function isWeekDisabled(weekMonday: number): boolean {
  return props.disabledDate?.(weekMonday) === true;
}

/* ─────────── Cell state predicates (day view) ─────────── */

function isCellSelected(ts: number): boolean {
  if (isRange.value) return false;
  if (isWeek.value) {
    // Whole-week highlight: every cell of the draft/committed week.
    const reference =
      isPanelOpen.value && dateDraft.value !== null ? dateDraft.value : singleModel.value;
    return reference !== null && isSameWeek(ts, reference);
  }
  if (!isPanelOpen.value) return singleModel.value !== null && isSameDay(ts, singleModel.value);
  return dateDraft.value !== null && isSameDay(ts, dateDraft.value);
}

function isCellStart(ts: number): boolean {
  if (isRange.value) {
    // Draft pick in progress — the draft start wins over the committed one
    // (restarting a pick must move the --start marker immediately).
    const start = rangeDraft.value.start;
    if (start !== null && rangeDraft.value.end === null) {
      return isWeek.value ? isSameWeek(ts, start) : isSameDay(ts, start);
    }
    const model = rangeModel.value;
    if (model !== null) return isWeek.value ? isSameWeek(ts, model[0]) : isSameDay(ts, model[0]);
    return start !== null && (isWeek.value ? isSameWeek(ts, start) : isSameDay(ts, start));
  }
  return false;
}

function isCellEnd(ts: number): boolean {
  if (isRange.value) {
    // No end picked yet — no --end marker (the pointer cell shows --cursor).
    if (rangeDraft.value.start !== null && rangeDraft.value.end === null) {
      return false;
    }
    const model = rangeModel.value;
    if (model !== null) return isWeek.value ? isSameWeek(ts, model[1]) : isSameDay(ts, model[1]);
    const end = rangeDraft.value.end;
    return end !== null && (isWeek.value ? isSameWeek(ts, end) : isSameDay(ts, end));
  }
  return false;
}

function rangeBounds(): { start: number | null; end: number | null } {
  // Draft pick in progress (start set, end pending) — the preview wins over
  // the committed model so restarting a pick clears the old interval at once.
  if (isRange.value && rangeDraft.value.start !== null && rangeDraft.value.end === null) {
    const a = startOfDay(rangeDraft.value.start);
    const b = startOfDay(rangeHoverEnd.value ?? cursor.value);
    return a <= b ? { start: a, end: b } : { start: b, end: a };
  }
  if (isRange.value && rangeModel.value !== null) {
    return { start: rangeModel.value[0], end: rangeModel.value[1] };
  }
  return rangeDraft.value;
}

function isCellInRange(ts: number): boolean {
  const { start, end } = rangeBounds();
  if (start === null || end === null) return false;
  const day = startOfDay(ts);
  // Week ranges highlight through the END of the end-week (Monday + 6d).
  const endBound = isWeek.value ? startOfWeek(end) + 6 * 86_400_000 : startOfDay(end);
  return day > startOfDay(start) && day < endBound;
}

/* ─────────── Quarter / month / year view predicates ─────────── */

/** Quarter-precision range bounds for `quarterrange` (draft wins over model). */
function quarterRangeBounds(): { start: number | null; end: number | null } {
  const draft = rangeDraft.value;
  if (draft.start !== null && draft.end === null) {
    return { start: startOfQuarter(draft.start), end: null };
  }
  const model = rangeModel.value;
  if (model !== null) {
    return { start: startOfQuarter(model[0]), end: startOfQuarter(model[1]) };
  }
  return {
    start: draft.start === null ? null : startOfQuarter(draft.start),
    end: draft.end === null ? null : startOfQuarter(draft.end),
  };
}

function isQuarterCellSelected(ts: number, calYear: number): boolean {
  if (isQuarter.value) {
    if (isRange.value) {
      const { start, end } = quarterRangeBounds();
      return (
        (start !== null && isSameQuarter(ts, start)) || (end !== null && isSameQuarter(ts, end))
      );
    }
    if (!isPanelOpen.value || dateDraft.value === null) {
      return singleModel.value !== null && isSameQuarter(ts, singleModel.value);
    }
    return isSameQuarter(ts, dateDraft.value);
  }
  // date modes: navigation grid — highlight the anchor quarter.
  return isSameQuarter(ts, anchorTs.value) && getDateParts(ts).year === calYear;
}

function isQuarterCellStart(ts: number): boolean {
  if (!isRange.value || !isQuarter.value) return false;
  const { start } = quarterRangeBounds();
  return start !== null && isSameQuarter(ts, start);
}

function isQuarterCellEnd(ts: number): boolean {
  if (!isRange.value || !isQuarter.value) return false;
  const { end } = quarterRangeBounds();
  return end !== null && isSameQuarter(ts, end);
}

function isQuarterCellInRange(ts: number): boolean {
  if (!isRange.value || !isQuarter.value) return false;
  const { start, end } = quarterRangeBounds();
  if (start === null || end === null) return false;
  const cell = startOfQuarter(ts);
  return cell > start && cell < end;
}

function isQuarterCellCursor(ts: number, calYear: number): boolean {
  return isSameQuarter(ts, cursor.value) && getDateParts(ts).year === calYear;
}

/** Quarter / month / year cells disable via their period start. */
function isQuarterCellDisabled(ts: number): boolean {
  return props.disabledDate?.(startOfQuarter(ts)) === true;
}

function isMonthCellSelected(ts: number, calYear: number): boolean {
  if (props.type === 'month') {
    if (!isPanelOpen.value || dateDraft.value === null) {
      return singleModel.value !== null && isSameMonth(ts, singleModel.value);
    }
    return isSameMonth(ts, dateDraft.value);
  }
  // date modes: navigation grid — highlight the anchor month.
  return isSameMonth(ts, anchorTs.value) && getDateParts(ts).year === calYear;
}

function isMonthCellCursor(ts: number, calYear: number): boolean {
  return isSameMonth(ts, cursor.value) && getDateParts(ts).year === calYear;
}

/** Month cells disable via the 1st of the month. */
function isMonthCellDisabled(ts: number): boolean {
  return props.disabledDate?.(startOfMonthTs(ts)) === true;
}

function isYearCellSelected(ts: number): boolean {
  if (props.type === 'year') {
    if (!isPanelOpen.value || dateDraft.value === null) {
      return singleModel.value !== null && isSameYear(ts, singleModel.value);
    }
    return isSameYear(ts, dateDraft.value);
  }
  return isSameYear(ts, anchorTs.value);
}

function isYearCellCursor(ts: number): boolean {
  return isSameYear(ts, cursor.value);
}

/** Year cells disable via Jan 1 of the year. */
function isYearCellDisabled(ts: number): boolean {
  return props.disabledDate?.(startOfYearTs(ts)) === true;
}

/* ─────────── Month range (dual year | month panes) ─────────── */

interface SnMonthPaneViewModel {
  side: SnRangeSide;
  year: number;
  /** 0-based month shown in the pane header. */
  month: number;
  /** Scrollable year window centred on the pane's year. */
  years: number[];
}

const monthPanes = computed<SnMonthPaneViewModel[]>(() =>
  (['start', 'end'] as const).map((side) => {
    const year = monthPaneYear.value[side];
    const reference =
      (side === 'start' ? rangeDraft.value.start : rangeDraft.value.end) ??
      rangeModel.value?.[side === 'start' ? 0 : 1] ??
      anchorTs.value;
    return {
      side,
      year,
      month: getDateParts(reference).month,
      years: rangeInclusive(year - 5, year + 6),
    };
  }),
);

/** First-day timestamp of a month cell in the given pane. */
function monthCellTs(side: SnRangeSide, monthIdx: number): number {
  return buildDate(monthPaneYear.value[side], monthIdx, 1);
}

/**
 * Month-precision range bounds. During the first pick only the start is
 * known; hovering a month previews the interval just like the day range.
 */
function monthRangeBounds(): { start: number | null; end: number | null } {
  const draft = rangeDraft.value;
  if (draft.start !== null && draft.end === null) {
    const a = startOfMonthTs(draft.start);
    const b = monthHoverEnd.value === null ? null : startOfMonthTs(monthHoverEnd.value);
    if (b === null) return { start: a, end: null };
    return a <= b ? { start: a, end: b } : { start: b, end: a };
  }
  const model = rangeModel.value;
  if (model !== null) {
    return { start: startOfMonthTs(model[0]), end: startOfMonthTs(model[1]) };
  }
  return {
    start: draft.start === null ? null : startOfMonthTs(draft.start),
    end: draft.end === null ? null : startOfMonthTs(draft.end),
  };
}

function monthCellSelected(side: SnRangeSide, monthIdx: number): boolean {
  const ts = monthCellTs(side, monthIdx);
  const { start, end } = monthRangeBounds();
  return (start !== null && isSameMonth(ts, start)) || (end !== null && isSameMonth(ts, end));
}

function monthCellClasses(side: SnRangeSide, monthIdx: number): Record<string, boolean> {
  const ts = monthCellTs(side, monthIdx);
  const { start, end } = monthRangeBounds();
  const cell = startOfMonthTs(ts);
  return {
    'sn-date-picker-month-cell--selected': monthCellSelected(side, monthIdx),
    'sn-date-picker-month-cell--start': start !== null && cell === start,
    'sn-date-picker-month-cell--end': end !== null && cell === end,
    'sn-date-picker-month-cell--in-range':
      start !== null && end !== null && cell > start && cell < end,
    'sn-date-picker-month-cell--disabled': isMonthCellDisabled(ts),
  };
}

function onMonthPaneYearClick(side: SnRangeSide, year: number): void {
  if (!isInteractive.value) return;
  monthPaneYear.value = { ...monthPaneYear.value, [side]: year };
}

function onMonthPaneHover(side: SnRangeSide, monthIdx: number): void {
  if (!isInteractive.value || rangeDraft.value.start === null || rangeDraft.value.end !== null) {
    return;
  }
  monthHoverEnd.value = monthCellTs(side, monthIdx);
}

function onMonthPaneMonthClick(side: SnRangeSide, monthIdx: number): void {
  if (!isInteractive.value) return;
  const ts = monthCellTs(side, monthIdx);
  if (isMonthCellDisabled(ts)) return;
  cursor.value = ts;
  if (rangeDraft.value.start === null || rangeDraft.value.end !== null) {
    rangeDraft.value = { start: ts, end: null };
    monthHoverEnd.value = null;
    emit('select', ts);
    return;
  }
  const start = rangeDraft.value.start;
  const [lo, hi] = ts < start ? [ts, start] : [start, ts];
  rangeDraft.value = { start: lo, end: hi };
  monthHoverEnd.value = null;
  monthPaneYear.value = {
    start: getDateParts(lo).year,
    end: getDateParts(hi).year,
  };
  emit('select', [lo, hi]);
  commitRange();
}

/** Keyboard pick in month-range mode — uses the cursor's own year/month. */
function onMonthRangePick(ms: number): void {
  const p = getDateParts(ms);
  monthPaneYear.value = { ...monthPaneYear.value, start: p.year };
  onMonthPaneMonthClick('start', p.month);
}

/** Scroll both panes so the NEXT year / month follows the pane header (the
 * header carries the current value, mirroring the reference layout). */
function scrollMonthPanesToSelection(): void {
  const panes = panelRef.value?.querySelectorAll<HTMLElement>('.sn-date-picker-month-pane');
  panes?.forEach((pane) => {
    pane.querySelectorAll<HTMLElement>('.sn-date-picker-month-pane__col').forEach((col) => {
      const current = col.querySelector<HTMLElement>('.sn-date-picker-month-cell--current');
      if (current) col.scrollTop = current.offsetTop - col.offsetTop + current.offsetHeight;
    });
  });
}

/* ─────────── Time columns ─────────── */

const timeColumns = computed(() => [
  { key: 'hour' as const, values: rangeInclusive(0, 23) },
  { key: 'minute' as const, values: rangeInclusive(0, 59) },
  { key: 'second' as const, values: rangeInclusive(0, 59) },
]);

/* ─────────── aria-activedescendant ─────────── */

const activeDescendant = computed<string | null>(() => {
  if (!isPanelOpen.value || isMonthRange.value) return null;
  if (viewMode.value === 'day') {
    return cellId(startOfDay(cursor.value));
  }
  // Unit views always anchor on the left calendar.
  const p = getDateParts(cursor.value);
  const kind =
    viewMode.value === 'quarter' ? 'q' : viewMode.value === 'month' ? 'm' : ('y' as const);
  const value =
    viewMode.value === 'quarter'
      ? Math.floor(p.month / 3)
      : viewMode.value === 'month'
        ? p.month
        : p.year;
  return unitCellId('a', kind, value);
});

/* ─────────── Panel positioning (simplified popper) ─────────── */

const PANEL_VIEWPORT_GAP = 4;
const placement = ref<'bottom' | 'top'>('bottom');
const panelStyle = ref<Record<string, string>>({});

function repositionPanel(): void {
  const root = rootRef.value;
  const panel = panelRef.value;
  if (!root || !panel) return;
  const rootRect = root.getBoundingClientRect();
  // offsetWidth/offsetHeight read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const panelWidth = panel.offsetWidth;
  const panelHeight = panel.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const left = Math.min(
    Math.max(PANEL_VIEWPORT_GAP, rootRect.left),
    Math.max(PANEL_VIEWPORT_GAP, vw - panelWidth - PANEL_VIEWPORT_GAP),
  );

  // Bottom preferred; flip to top when the viewport lacks room below
  // but has room above.
  const roomBelow = vh - rootRect.bottom;
  const roomAbove = rootRect.top;
  const useTop = roomBelow < panelHeight && roomAbove > roomBelow;
  placement.value = useTop ? 'top' : 'bottom';

  const top = useTop ? Math.max(PANEL_VIEWPORT_GAP, rootRect.top - panelHeight) : rootRect.bottom;

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    'min-width': `${Math.round(rootRect.width)}px`,
  };
}

/* Scroll/resize follow: while the panel is open, any scroll (page or a
 * nested scrollable ancestor) or viewport resize re-runs repositionPanel so
 * the fixed-position panel stays glued to the trigger instead of detaching. */
const followViewport = useOverlayFollow(rootRef, panelRef, repositionPanel, isPanelOpen);

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  if (!isPanelOpen.value) return;
  const target = event.target as Node | null;
  if (!target) return;
  if (rootRef.value && rootRef.value.contains(target)) return;
  if (panelRef.value && panelRef.value.contains(target)) return;
  closePanel();
}

/* ─────────── Open / close ─────────── */

function initDraftsFromModel(): void {
  const now = Date.now();
  timePopoverSide.value = null;
  monthHoverEnd.value = null;
  if (isRange.value) {
    const v = rangeModel.value;
    if (v !== null) {
      rangeDraft.value = { start: startOfDay(v[0]), end: startOfDay(v[1]) };
      rangeHoverEnd.value = null;
      const sa = getDateParts(v[0]);
      const sb = getDateParts(v[1]);
      rangeTimeDraft.value = {
        start: { hour: sa.hour, minute: sa.minute, second: sa.second },
        end: { hour: sb.hour, minute: sb.minute, second: sb.second },
      };
      anchorTs.value = v[0];
      cursor.value = v[0];
      monthPaneYear.value = {
        start: sa.year,
        end: sb.year,
      };
    } else {
      rangeDraft.value = { start: null, end: null };
      rangeHoverEnd.value = null;
      rangeTimeDraft.value = {
        start: { hour: 0, minute: 0, second: 0 },
        end: { hour: 0, minute: 0, second: 0 },
      };
      anchorTs.value = now;
      cursor.value = now;
      monthPaneYear.value = defaultMonthPaneYears();
    }
  } else {
    const v = singleModel.value;
    if (v !== null) {
      dateDraft.value = startOfDay(v);
      const p = getDateParts(v);
      timeDraft.value = { hour: p.hour, minute: p.minute, second: p.second };
      anchorTs.value = v;
      cursor.value = v;
    } else {
      dateDraft.value = startOfDay(now);
      timeDraft.value = { hour: 0, minute: 0, second: 0 };
      anchorTs.value = now;
      cursor.value = now;
    }
  }
  viewMode.value =
    props.type === 'month'
      ? 'month'
      : props.type === 'year'
        ? 'year'
        : isQuarter.value
          ? 'quarter'
          : 'day';
}

function openPanel(): void {
  if (!isInteractive.value || isPanelOpen.value) return;
  isPanelOpen.value = true;
  initDraftsFromModel();
  void nextTick(() => {
    repositionPanel();
    followViewport.start();
    scrollMonthPanesToSelection();
  });
}

function closePanel(): void {
  if (!isPanelOpen.value) return;
  isPanelOpen.value = false;
  rangeHoverEnd.value = null;
  monthHoverEnd.value = null;
  timePopoverSide.value = null;
  followViewport.stop();
}

/* ─────────── Commit ─────────── */

function emitCommit(value: number | [number, number] | null): void {
  emit('update:modelValue', value);
  emit('change', value);
}

function commitSingle(): void {
  emitCommit(commitSingleValue());
}

/** The value the current draft/cursor state resolves to (single modes). */
function commitSingleValue(): number {
  // Commit from the cursor (kept in sync on every cell click and keyboard
  // move) — not from dateDraft, so keyboard-moved-but-unconfirmed days
  // confirm exactly what the panel highlights. Week / quarter picks keep
  // the cursor on their period start, so the plain day branch covers them.
  const day = startOfDay(cursor.value);
  return hasTime.value
    ? combineDateTime(day, timeDraft.value.hour, timeDraft.value.minute, timeDraft.value.second)
    : props.type === 'month'
      ? startOfMonthTs(day)
      : props.type === 'year'
        ? startOfYearTs(day)
        : day;
}

function startOfMonthTs(ms: number): number {
  const p = getDateParts(ms);
  return new Date(p.year, p.month, 1).getTime();
}

function startOfYearTs(ms: number): number {
  const p = getDateParts(ms);
  return new Date(p.year, 0, 1).getTime();
}

function commitRange(): void {
  const { start, end } = rangeDraft.value;
  if (start === null || end === null) return;
  const s = hasTime.value
    ? combineDateTime(
        start,
        rangeTimeDraft.value.start.hour,
        rangeTimeDraft.value.start.minute,
        rangeTimeDraft.value.start.second,
      )
    : start;
  const e = hasTime.value
    ? combineDateTime(
        end,
        rangeTimeDraft.value.end.hour,
        rangeTimeDraft.value.end.minute,
        rangeTimeDraft.value.end.second,
      )
    : end;
  emitCommit([s, e]);
}

function clearValue(): void {
  if (!isInteractive.value) return;
  emitCommit(null);
  emit('clear');
  closePanel();
}

/* ─────────── Cell interactions ─────────── */

function onDayCellClick(ts: number): void {
  if (!isInteractive.value) return;
  // Week types normalize any clicked day to its week's Monday.
  const day = isWeek.value ? startOfWeek(ts) : startOfDay(ts);
  if (isCellDisabled(day) || (isWeek.value && isWeekDisabled(day))) return;
  cursor.value = day;
  if (isRange.value) {
    if (rangeDraft.value.start === null || rangeDraft.value.end !== null) {
      // Fresh pick: start over with the clicked day as start.
      rangeDraft.value = { start: day, end: null };
      rangeHoverEnd.value = null;
      emit('select', day);
    } else {
      // Second pick: swap when end < start, then commit.
      const start = rangeDraft.value.start;
      const [lo, hi] = day < start ? [day, start] : [start, day];
      rangeDraft.value = { start: lo, end: hi };
      rangeHoverEnd.value = null;
      emit('select', [lo, hi]);
      if (hasTime.value) {
        commitRange(); // datetimerange keeps the panel open (确认 closes)
      } else {
        commitRange();
        closePanel();
      }
    }
    return;
  }
  dateDraft.value = day;
  commitSingle();
  emit('select', commitSingleValue());
  if (!hasTime.value) closePanel();
}

/**
 * Range draft preview: while picking the end date, the hovered cell becomes
 * the provisional end so `--in-range` light background tracks the pointer.
 * Outside the draft phase (or in single modes) this is a no-op.
 */
function onDayCellHover(ts: number): void {
  if (!isRange.value || !isInteractive.value) return;
  if (rangeDraft.value.start !== null && rangeDraft.value.end === null) {
    rangeHoverEnd.value = isWeek.value ? startOfWeek(ts) : startOfDay(ts);
  }
}

function onQuarterCellClick(ts: number): void {
  if (!isInteractive.value || isQuarterCellDisabled(ts)) return;
  cursor.value = ts;
  if (isQuarter.value) {
    if (isRange.value) {
      if (rangeDraft.value.start === null || rangeDraft.value.end !== null) {
        rangeDraft.value = { start: ts, end: null };
        rangeHoverEnd.value = null;
        emit('select', ts);
        return;
      }
      const start = rangeDraft.value.start;
      const [lo, hi] = ts < start ? [ts, start] : [start, ts];
      rangeDraft.value = { start: lo, end: hi };
      rangeHoverEnd.value = null;
      emit('select', [lo, hi]);
      commitRange();
      closePanel();
      return;
    }
    dateDraft.value = ts;
    commitSingle();
    emit('select', ts);
    closePanel();
    return;
  }
  // date modes: drill back into the day grid anchored at that quarter.
  viewMode.value = 'day';
  anchorTs.value = ts;
}

function onMonthCellClick(ts: number): void {
  if (!isInteractive.value || isMonthCellDisabled(ts)) return;
  cursor.value = ts;
  if (props.type === 'month') {
    dateDraft.value = ts;
    commitSingle();
    emit('select', ts);
    closePanel();
    return;
  }
  // date modes: drill back into the day grid anchored at that month.
  viewMode.value = 'day';
  anchorTs.value = ts;
}

function onYearCellClick(ts: number): void {
  if (!isInteractive.value || isYearCellDisabled(ts)) return;
  cursor.value = ts;
  if (props.type === 'year') {
    dateDraft.value = ts;
    commitSingle();
    emit('select', ts);
    closePanel();
    return;
  }
  viewMode.value = isQuarter.value ? 'quarter' : 'month';
  anchorTs.value = ts;
}

function onTimeCellClick(side: SnRangeSide, unit: SnTimeUnit, value: number): void {
  if (!isInteractive.value) return;
  if (isRange.value) {
    rangeTimeDraft.value[side][unit] = value;
    if (rangeDraft.value.start !== null && rangeDraft.value.end !== null) commitRange();
    return;
  }
  timeDraft.value[unit] = value;
  commitSingle();
}

/* ─────────── Datetime-range time popover ─────────── */

/** Toggle the popover for one side's time field and scroll to its selection. */
function openTimePopover(side: SnRangeSide): void {
  timePopoverSide.value = timePopoverSide.value === side ? null : side;
  if (timePopoverSide.value !== null) {
    void nextTick(scrollTimePopoverToSelection);
  }
}

function closeTimePopover(): void {
  timePopoverSide.value = null;
}

function onPopoverTimeCellClick(unit: SnTimeUnit, value: number): void {
  const side = timePopoverSide.value;
  if (side === null) return;
  onTimeCellClick(side, unit, value);
}

/** 此刻 — set the open side's time-of-day to the current clock. */
function setCurrentTime(): void {
  const side = timePopoverSide.value;
  if (side === null || !isInteractive.value) return;
  const now = new Date();
  rangeTimeDraft.value[side] = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
  if (rangeDraft.value.start !== null && rangeDraft.value.end !== null) commitRange();
  void nextTick(scrollTimePopoverToSelection);
}

/** Align each column so the NEXT value follows the popover header (the
 * header already shows the selected value, so the selected row scrolls just
 * above the viewport — same as the reference time spinner). */
function scrollTimePopoverToSelection(): void {
  const cols = panelRef.value?.querySelectorAll<HTMLElement>(
    '.sn-date-picker-time-popover .sn-date-picker-time-col',
  );
  cols?.forEach((col) => {
    const selected = col.querySelector<HTMLElement>('.sn-date-picker-time-item--selected');
    if (selected) col.scrollTop = selected.offsetTop - col.offsetTop + selected.offsetHeight;
  });
}

/** Footer 清除 — reset the panel drafts without closing it. */
function clearPanelDraft(): void {
  if (!isInteractive.value) return;
  timePopoverSide.value = null;
  rangeDraft.value = { start: null, end: null };
  rangeHoverEnd.value = null;
  monthHoverEnd.value = null;
  monthPaneYear.value = defaultMonthPaneYears();
  emitCommit(null);
  emit('clear');
}

function confirmAndClose(): void {
  if (!isInteractive.value) return;
  if (isRange.value) {
    // datetime ranges commit again on confirm so the latest time draft wins;
    // month ranges already committed on the second pick.
    if (hasTime.value && rangeDraft.value.start !== null && rangeDraft.value.end !== null) {
      commitRange();
    }
  } else {
    commitSingle();
  }
  closePanel();
}

/* ─────────── Shortcuts + today ─────────── */

/** Resolve a shortcut entry (lazy getters run at click time) and commit. */
function onShortcutClick(sc: SnDatePickerShortcut): void {
  if (!isInteractive.value) return;
  const resolved = typeof sc.value === 'function' ? sc.value() : sc.value;
  emitCommit(resolved);
  emit('select', resolved);
  closePanel();
}

/** 今天 footer — commit the current date and close. */
function jumpToday(): void {
  if (!isInteractive.value) return;
  const now = Date.now();
  cursor.value = now;
  dateDraft.value = startOfDay(now);
  commitSingle();
  emit('select', commitSingleValue());
  closePanel();
}

/* ─────────── Header navigation ─────────── */

/**
 * Shift anchors by the active view's small step: one month for the day grid,
 * one year for quarter / month-of-year grids, one decade for the year grid.
 * The double-chevron passes `navBigStep` small steps.
 */
function shiftAnchor(deltaSteps: number): void {
  if (viewMode.value === 'day') {
    anchorTs.value = addMonths(anchorTs.value, deltaSteps);
    cursor.value = addMonths(cursor.value, deltaSteps);
    return;
  }
  const years = viewMode.value === 'year' ? deltaSteps * 10 : deltaSteps;
  anchorTs.value = addYears(anchorTs.value, years);
  cursor.value = addYears(cursor.value, years);
}

function onTitleClick(): void {
  if (viewMode.value === 'day' || viewMode.value === 'quarter') viewMode.value = 'month';
  else if (viewMode.value === 'month') viewMode.value = 'year';
}

/* ─────────── Keyboard ─────────── */

function stepCursor(deltaDays: number): void {
  cursor.value = startOfDay(cursor.value + deltaDays * 86_400_000);
  // Keep the grid in view when the cursor leaves the anchored month.
  if (viewMode.value === 'day' && !isSameMonth(cursor.value, anchorTs.value)) {
    anchorTs.value = cursor.value;
  }
}

function pageCursor(delta: 1 | -1): void {
  const months = viewMode.value === 'day' ? delta : delta * 12;
  cursor.value = addMonths(cursor.value, months);
  anchorTs.value = cursor.value;
}

function pickCursor(): void {
  const day = startOfDay(cursor.value);
  if (viewMode.value === 'day') {
    onDayCellClick(day);
    return;
  }
  if (viewMode.value === 'month') {
    onMonthCellClick(day);
    return;
  }
  onYearCellClick(day);
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  if (isMonthRange.value) {
    onMonthRangeKeyDown(event);
    return;
  }
  switch (event.key) {
    case 'Enter': {
      event.preventDefault();
      if (!isPanelOpen.value) {
        openPanel();
        return;
      }
      if (hasTime.value) {
        confirmAndClose();
      } else {
        pickCursor();
      }
      break;
    }
    case ' ': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      break;
    }
    case 'Escape': {
      if (isPanelOpen.value) {
        event.preventDefault();
        closePanel();
      }
      break;
    }
    case 'ArrowLeft': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      stepCursor(viewMode.value === 'day' ? -1 : 0);
      if (viewMode.value !== 'day') pageCursor(-1);
      break;
    }
    case 'ArrowRight': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      stepCursor(viewMode.value === 'day' ? 1 : 0);
      if (viewMode.value !== 'day') pageCursor(1);
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      stepCursor(-7);
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      stepCursor(7);
      break;
    }
    case 'PageUp': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      pageCursor(-1);
      break;
    }
    case 'PageDown': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      pageCursor(1);
      break;
    }
    default:
      break;
  }
}

/** Month-range keyboard: months on ←/→, quarters on ↑/↓, years on PageUp/Down. */
function onMonthRangeKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'Enter': {
      event.preventDefault();
      if (!isPanelOpen.value) {
        openPanel();
        return;
      }
      if (rangeDraft.value.start !== null && rangeDraft.value.end !== null) confirmAndClose();
      else onMonthRangePick(cursor.value);
      break;
    }
    case ' ': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      break;
    }
    case 'Escape': {
      if (isPanelOpen.value) {
        event.preventDefault();
        closePanel();
      }
      break;
    }
    case 'ArrowLeft':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      cursor.value = addMonths(cursor.value, -1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      cursor.value = addMonths(cursor.value, 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      cursor.value = addMonths(cursor.value, -3);
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      cursor.value = addMonths(cursor.value, 3);
      break;
    case 'PageUp':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      cursor.value = addYears(cursor.value, -1);
      break;
    case 'PageDown':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      cursor.value = addYears(cursor.value, 1);
      break;
    default:
      break;
  }
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  // Keep focus on the trigger — no text-selection caret on the wrapper.
  event.preventDefault();
}

function onTriggerClick(): void {
  if (!isInteractive.value) return;
  if (isPanelOpen.value) closePanel();
  else openPanel();
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false;
  emit('blur', event);
}

/* ─────────── Listeners lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown);
  followViewport.stop();
});

watch(
  () => props.modelValue,
  () => {
    // External value change while open — keep the panel drafts in sync.
    if (isPanelOpen.value) initDraftsFromModel();
  },
);
</script>

<style scoped>
.sn-date-picker {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-date-picker__selection {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: var(--sn-web-date-picker-height, 34px);
  padding: 0 var(--sn-web-date-picker-padding-x, 10px);
  width: var(--sn-web-date-picker-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-date-picker-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-date-picker-radius, 6px);
  background-color: var(--sn-web-date-picker-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-date-picker-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  outline: none;
}

/* Focus / active halo is derived from the theme primary — the global
 * --sn-web-focus-ring stays blue under custom primary themes, which made
 * the trigger look two-toned next to the primary-coloured selection. */
.sn-date-picker__selection:focus-visible {
  border-color: var(--sn-web-date-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px
    var(
      --sn-web-date-picker-focus-ring,
      color-mix(in srgb, var(--sn-web-color-action-primary) 24%, transparent)
    );
}

.sn-date-picker--active .sn-date-picker__selection {
  border-color: var(--sn-web-date-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px
    var(
      --sn-web-date-picker-focus-ring,
      color-mix(in srgb, var(--sn-web-color-action-primary) 24%, transparent)
    );
}

/* Sizes — height + font-size presets (mirror SnSelect / SnTimePicker). */
.sn-date-picker--mini {
  --sn-web-date-picker-height: 22px;
  font-size: 11px;
}
.sn-date-picker--tiny {
  --sn-web-date-picker-height: 24px;
  font-size: 12px;
}
.sn-date-picker--small {
  --sn-web-date-picker-height: 28px;
  font-size: 13px;
}
.sn-date-picker--medium {
  --sn-web-date-picker-height: 32px;
  font-size: 14px;
}
.sn-date-picker--large {
  --sn-web-date-picker-height: 40px;
  font-size: 15px;
}

.sn-date-picker__value,
.sn-date-picker__placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
  font-variant-numeric: tabular-nums;
}

.sn-date-picker__placeholder {
  color: var(--sn-web-date-picker-placeholder-color, var(--sn-web-color-text-tertiary));
}

.sn-date-picker__separator {
  color: var(--sn-web-date-picker-separator-color, var(--sn-web-color-text-tertiary));
}

/* Suffix: clear / arrow */
.sn-date-picker__suffix {
  position: absolute;
  right: var(--sn-web-date-picker-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-date-picker__suffix > * {
  pointer-events: auto;
}

.sn-date-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-date-picker-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-date-picker__clear:hover {
  color: var(--sn-web-date-picker-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-color-background-subtle);
}

.sn-date-picker__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-date-picker-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-date-picker__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-date-picker--disabled .sn-date-picker__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-date-picker-bg-disabled, var(--sn-web-color-background-subtle));
  color: var(--sn-web-date-picker-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-date-picker-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-date-picker--disabled .sn-date-picker__placeholder {
  color: var(--sn-web-date-picker-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-date-picker--readonly .sn-date-picker__selection {
  cursor: default;
  background-color: var(--sn-web-date-picker-bg-readonly, var(--sn-web-color-background-subtle));
}

/* Status */
.sn-date-picker--status-error .sn-date-picker__selection {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-date-picker--status-warning .sn-date-picker__selection {
  border-color: var(--sn-web-color-feedback-warning);
}

/* Suffix overlap guard: leave room for the arrow / clear button. */
.sn-date-picker__selection {
  padding-right: calc(var(--sn-web-date-picker-padding-x, 10px) + 22px);
}
</style>

<style scoped>
/* Date panel — teleported to body, so it lives in its own (non-scoped-alias)
 * style block, mirroring the SnSelect / SnTimePicker convention. Teleported
 * nodes still receive the scoped attribute, so both blocks stay in this SFC. */
.sn-date-picker-panel {
  position: fixed;
  z-index: var(--sn-web-date-picker-panel-z-index, 2000);
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-date-picker-panel-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-date-picker-panel-radius, 3px);
  background-color: var(--sn-web-date-picker-panel-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-date-picker-panel-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
  font-size: var(--sn-web-date-picker-panel-font-size, 13px);
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-date-picker-panel--bottom {
  transform-origin: center top;
}

.sn-date-picker-panel--top {
  transform-origin: center bottom;
}

/* sn-pop — naive fade-in-scale-up: enter rises into place, leave fades out. */
.sn-pop-enter-active {
  transition:
    opacity 0.18s cubic-bezier(0, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-leave-active {
  transition:
    opacity 0.15s cubic-bezier(0, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.92);
}

.sn-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Panel layout: [side shortcuts] [calendars + aside time] stacked over the
 * bottom shortcuts bar and the footer. The body is the flex row. */
.sn-date-picker-panel__layout {
  display: flex;
  align-items: stretch;
}

.sn-date-picker-panel__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/**
 * Range panels are sized by their two calendars, NOT by the intrinsic width
 * of four <input> elements (each defaults to ~20 characters). Leaving the
 * inputs to drive the shrink-to-fit panel produced a large empty area to the
 * right of the calendars. `--sn-web-date-picker-cell-size` stays the single
 * knob: one grid = 7 cells + 6×2px gaps; two grids + 12px gap = body width.
 */
.sn-date-picker-panel--range .sn-date-picker-panel__body {
  width: calc(2 * (7 * var(--sn-web-date-picker-cell-size, 28px) + 12px) + 12px);
  max-width: 100%;
}

/* Top position is the default DOM order (inputs → calendars → shortcuts). */
.sn-date-picker-panel__body--inputs-bottom .sn-date-picker-panel__calendars {
  order: 1;
}

.sn-date-picker-panel__body--inputs-bottom .sn-date-picker-panel__shortcuts--bottom {
  order: 2;
}

.sn-date-picker-panel__body--inputs-bottom .sn-date-picker-panel__inputs {
  order: 3;
}

/* Datetime range — four header fields spanning the dual calendars. */
.sn-date-picker-panel__inputs {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0 0 10px;
  padding: 0 0 8px;
  box-sizing: border-box;
  border-bottom: 1px solid
    var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

/* Bottom placement: separator above the bar, time popover opens upward. */
.sn-date-picker-panel__inputs--bottom {
  margin: 10px 0 0;
  padding: 8px 0 0;
  border-bottom: none;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__inputs--bottom .sn-date-picker-time-popover {
  top: auto;
  bottom: calc(100% + 2px);
}

/* Bottom placement has less headroom inside the panel — cap the columns so
 * the popover stays inside the panel instead of covering the trigger. */
.sn-date-picker-panel__inputs--bottom .sn-date-picker-time-col {
  max-height: 150px;
}

.sn-date-picker-panel__input-pair {
  display: flex;
  flex: 1 1 0;
  gap: 6px;
  min-width: 0;
}

.sn-date-picker-panel__input-divider {
  flex: 0 0 1px;
  align-self: stretch;
  background-color: var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-field {
  /* width:0 keeps the native ~20ch input size out of the panel's
   * shrink-to-fit calculation; flex-grow fills the calendar-width row. */
  width: 0;
  flex: 1 1 0;
  min-width: 0;
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-date-picker-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-date-picker-radius, 4px);
  background-color: var(--sn-web-date-picker-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-date-picker-text-color, var(--sn-web-color-text-primary));
  font: inherit;
  font-variant-numeric: tabular-nums;
  outline: none;
  cursor: default;
}

.sn-date-picker-field::placeholder {
  color: var(--sn-web-date-picker-placeholder-color, var(--sn-web-color-text-tertiary));
}

.sn-date-picker-field--time {
  cursor: pointer;
}

.sn-date-picker-field:focus,
.sn-date-picker-field--active {
  border-color: var(--sn-web-date-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--sn-web-color-action-primary) 18%, transparent);
}

/* Time popover — anchored under the clicked time field, overlays calendars. */
.sn-date-picker-time-popover {
  position: absolute;
  top: calc(100% + 2px);
  z-index: 5;
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-date-picker-panel-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-date-picker-panel-radius, 3px);
  background-color: var(--sn-web-date-picker-panel-bg, var(--sn-web-color-background-elevated));
  box-shadow: var(
    --sn-web-date-picker-panel-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
}

.sn-date-picker-time-popover--start {
  left: 8px;
}

.sn-date-picker-time-popover--end {
  left: 50%;
}

.sn-date-picker-time-popover__current {
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
}

.sn-date-picker-time-popover__current > span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-date-picker-time-col-width, 56px);
  height: var(--sn-web-date-picker-time-item-height, 30px);
  border-radius: var(--sn-web-date-picker-time-item-radius, 4px);
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04));
  color: var(--sn-web-color-action-primary);
  font-variant-numeric: tabular-nums;
}

.sn-date-picker-time-popover .sn-date-picker-panel__time {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.sn-date-picker-time-popover__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-time-popover__now {
  padding: 4px 10px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-date-picker-confirm-radius, 4px);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: inherit;
  cursor: pointer;
}

.sn-date-picker-time-popover__now:hover {
  border-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-action-primary);
}

.sn-date-picker-time-popover__footer .sn-date-picker-panel__confirm {
  margin-left: auto;
}

/* Month range — two side-by-side year | month panes. */
.sn-date-picker-panel__months {
  display: flex;
  gap: 12px;
}

.sn-date-picker-month-pane {
  display: flex;
  flex-direction: column;
  width: calc(7 * var(--sn-web-date-picker-cell-size, 28px) + 12px);
  box-sizing: border-box;
}

.sn-date-picker-month-pane + .sn-date-picker-month-pane {
  padding-left: 12px;
  border-left: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-month-pane__header {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}

.sn-date-picker-month-pane__current {
  flex: 1 1 0;
  padding: 6px 0;
  text-align: center;
  border-radius: var(--sn-web-date-picker-cell-radius, 4px);
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04));
  color: var(--sn-web-color-action-primary);
  font-variant-numeric: tabular-nums;
}

.sn-date-picker-month-pane__body {
  display: flex;
  gap: 4px;
  height: 180px;
  overflow: hidden;
}

.sn-date-picker-month-pane__col {
  flex: 1 1 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.sn-date-picker-month-pane__col::-webkit-scrollbar {
  display: none;
}

.sn-date-picker-month-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sn-web-date-picker-time-item-height, 30px);
  border-radius: var(--sn-web-date-picker-cell-radius, 4px);
  color: var(--sn-web-date-picker-cell-color, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  user-select: none;
}

.sn-date-picker-month-cell:hover {
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04));
}

.sn-date-picker-month-cell--current {
  color: var(--sn-web-color-action-primary);
}

.sn-date-picker-month-cell--selected,
.sn-date-picker-month-cell--start,
.sn-date-picker-month-cell--end {
  background-color: var(--sn-web-date-picker-cell-bg-selected, var(--sn-web-color-action-primary));
  color: var(--sn-web-date-picker-cell-text-color-selected, var(--sn-web-color-text-on-primary));
}

.sn-date-picker-month-cell--in-range {
  background-color: color-mix(in srgb, var(--sn-web-color-action-primary) 12%, transparent);
}

.sn-date-picker-month-cell--disabled {
  color: var(--sn-web-date-picker-cell-color-disabled, var(--sn-web-color-text-disabled));
  cursor: not-allowed;
}

.sn-date-picker-panel__calendars {
  display: flex;
  gap: 12px;
}

.sn-date-picker-calendar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sn-date-picker-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
}

.sn-date-picker-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-date-picker-nav-radius, 4px);
  background: transparent;
  color: var(--sn-web-date-picker-nav-color, var(--sn-web-color-text-secondary));
  cursor: pointer;
}

.sn-date-picker-nav:hover {
  background-color: var(--sn-web-date-picker-nav-bg-hover, var(--sn-web-color-background-subtle));
}

.sn-date-picker-calendar__title {
  flex: 1;
  padding: 2px 4px;
  border: none;
  border-radius: var(--sn-web-date-picker-nav-radius, 4px);
  background: transparent;
  color: var(--sn-web-date-picker-title-color, var(--sn-web-color-text-primary));
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
}

.sn-date-picker-calendar__title:hover {
  background-color: var(--sn-web-date-picker-nav-bg-hover, var(--sn-web-color-background-subtle));
}

/* Day grid */
.sn-date-picker-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sn-date-picker-grid__row {
  display: flex;
  gap: 2px;
}

.sn-date-picker-grid__weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-date-picker-cell-size, 28px);
  height: 22px;
  color: var(--sn-web-date-picker-weekday-color, var(--sn-web-color-text-tertiary));
  font-weight: 400;
}

.sn-date-picker-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-date-picker-cell-size, 28px);
  height: var(--sn-web-date-picker-cell-size, 28px);
  border-radius: var(--sn-web-date-picker-cell-radius, 4px);
  color: var(--sn-web-date-picker-cell-color, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.12s ease-out,
    color 0.12s ease-out;
}

.sn-date-picker-cell:hover {
  background-color: var(
    --sn-web-date-picker-cell-bg-hover,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04))
  );
}

.sn-date-picker-cell--other-month {
  color: var(--sn-web-date-picker-cell-color-other-month, var(--sn-web-color-text-disabled));
}

.sn-date-picker-cell--cursor:not(.sn-date-picker-cell--selected):not(
    .sn-date-picker-cell--start
  ):not(.sn-date-picker-cell--end) {
  box-shadow: inset 0 0 0 1px
    var(--sn-web-date-picker-cursor-border, var(--sn-web-color-action-primary));
}

.sn-date-picker-cell--selected,
.sn-date-picker-cell--start,
.sn-date-picker-cell--end {
  background-color: var(--sn-web-date-picker-cell-bg-selected, var(--sn-web-color-action-primary));
  color: var(--sn-web-date-picker-cell-text-color-selected, var(--sn-web-color-text-on-primary));
}

.sn-date-picker-cell--selected:hover,
.sn-date-picker-cell--start:hover,
.sn-date-picker-cell--end:hover {
  background-color: var(
    --sn-web-date-picker-cell-bg-selected-hover,
    var(--sn-web-color-action-primary-hover)
  );
}

.sn-date-picker-cell--in-range {
  background-color: var(
    --sn-web-date-picker-cell-bg-in-range,
    color-mix(in srgb, var(--sn-web-color-action-primary) 12%, transparent)
  );
}

.sn-date-picker-cell--unit {
  width: var(--sn-web-date-picker-unit-cell-size, 52px);
}

/* Unit views span the full day-grid width. Quarter cells are a 2x2 grid
 * with evenly sized cells instead of two squeezed 52px labels; month/year
 * views keep their 4-column layout but fill the same width. */
.sn-date-picker-grid--unit {
  width: calc(7 * var(--sn-web-date-picker-cell-size, 28px) + 12px);
}

.sn-date-picker-grid--unit .sn-date-picker-grid__row {
  gap: 6px;
}

.sn-date-picker-grid--unit .sn-date-picker-cell--unit {
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  height: 32px;
}

.sn-date-picker-grid--quarter .sn-date-picker-cell--unit {
  height: 36px;
}

/* Disabled cells — dimmed, click refused by the handlers. */
.sn-date-picker-cell--disabled {
  color: var(--sn-web-date-picker-cell-color-disabled, var(--sn-web-color-text-disabled));
  cursor: not-allowed;
  background-color: transparent;
}

.sn-date-picker-cell--disabled.sn-date-picker-cell--selected,
.sn-date-picker-cell--disabled.sn-date-picker-cell--start,
.sn-date-picker-cell--disabled.sn-date-picker-cell--end {
  background-color: var(--sn-web-date-picker-cell-bg-disabled, var(--sn-web-color-background-soft));
  color: var(--sn-web-date-picker-cell-color-disabled, var(--sn-web-color-text-disabled));
}

/* Aside time panel — sits right of its calendar (showTime 左右布局). */
.sn-date-picker-panel__time--aside {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__time--aside .sn-date-picker-time-group {
  height: 100%;
}

.sn-date-picker-panel__time--aside .sn-date-picker-time-group__label {
  text-align: center;
}

.sn-date-picker-panel__time--aside .sn-date-picker-panel__time {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

/* Quick-pick shortcuts — side column or bottom bar. */
.sn-date-picker-panel__shortcuts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sn-date-picker-panel__shortcuts--side {
  margin-right: 12px;
  padding-right: 12px;
  border-right: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__shortcuts--bottom {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__shortcut {
  padding: 4px 10px;
  border: none;
  border-radius: var(--sn-web-date-picker-shortcut-radius, 4px);
  background-color: var(--sn-web-date-picker-shortcut-bg, var(--sn-web-color-background-soft));
  color: var(--sn-web-date-picker-shortcut-color, var(--sn-web-color-text-secondary));
  font-size: inherit;
  cursor: pointer;
  white-space: nowrap;
}

.sn-date-picker-panel__shortcut:hover {
  background-color: var(--sn-web-date-picker-cell-bg-selected, var(--sn-web-color-action-primary));
  color: var(--sn-web-color-text-on-primary);
}

/* Datetime columns */
.sn-date-picker-panel__time {
  display: flex;
  gap: 2px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__time--range {
  gap: 12px;
}

.sn-date-picker-time-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sn-date-picker-time-group__label {
  color: var(--sn-web-date-picker-time-label-color, var(--sn-web-color-text-tertiary));
  font-size: 11px;
}

.sn-date-picker-time-col {
  width: var(--sn-web-date-picker-time-col-width, 56px);
  height: var(--sn-web-date-picker-time-col-height, 180px);
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: var(--sn-web-date-picker-time-col-radius, 4px);
  scrollbar-width: none;
}

.sn-date-picker-time-col::-webkit-scrollbar {
  display: none;
}

.sn-date-picker-time-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sn-web-date-picker-time-item-height, 30px);
  border-radius: var(--sn-web-date-picker-time-item-radius, 4px);
  color: var(--sn-web-date-picker-time-item-color, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  user-select: none;
}

.sn-date-picker-time-item:hover {
  background-color: var(
    --sn-web-date-picker-time-item-bg-hover,
    var(--sn-web-color-background-subtle)
  );
}

.sn-date-picker-time-item--selected {
  background-color: var(
    --sn-web-date-picker-time-item-bg-selected,
    var(--sn-web-color-action-primary)
  );
  color: var(
    --sn-web-date-picker-time-item-text-color-selected,
    var(--sn-web-color-text-on-primary)
  );
}

/* Footer */
.sn-date-picker-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

/* 今天 jump — left aligned; when absent the confirm floats right. */
.sn-date-picker-panel__today {
  padding: 4px 10px;
  border: none;
  border-radius: var(--sn-web-date-picker-confirm-radius, 4px);
  background: transparent;
  color: var(--sn-web-date-picker-today-color, var(--sn-web-color-action-primary));
  font-size: inherit;
  cursor: pointer;
}

.sn-date-picker-panel__today:hover {
  background-color: var(--sn-web-color-background-soft);
}

.sn-date-picker-panel__footer .sn-date-picker-panel__confirm {
  margin-left: auto;
}

/* 清除 — plain ghost button next to 确认 in confirmable range panels. */
.sn-date-picker-panel__clear {
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid var(--sn-web-date-picker-panel-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-date-picker-confirm-radius, 4px);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: inherit;
  cursor: pointer;
}

.sn-date-picker-panel__clear:hover {
  border-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-action-primary);
}

.sn-date-picker-panel__clear + .sn-date-picker-panel__confirm {
  margin-left: 0;
}

.sn-date-picker-panel__confirm {
  padding: 4px 12px;
  border: none;
  border-radius: var(--sn-web-date-picker-confirm-radius, 4px);
  background-color: var(--sn-web-date-picker-confirm-bg, var(--sn-web-color-action-primary));
  color: var(--sn-web-date-picker-confirm-text-color, var(--sn-web-color-text-on-primary));
  font-size: inherit;
  cursor: pointer;
}

.sn-date-picker-panel__confirm:hover {
  background-color: var(
    --sn-web-date-picker-confirm-bg-hover,
    var(--sn-web-color-action-primary-hover)
  );
}
</style>
