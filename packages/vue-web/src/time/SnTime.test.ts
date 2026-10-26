import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnTime from './SnTime.vue';

/** Mount SnTime through a wrapper component, mirroring real usage. */
function mountTime(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnTime },
      setup() {
        return () => h(SnTime, props as never);
      },
    }),
  );
}

describe('SnTime (AUI-WEB-DD-019)', () => {
  describe('rendering', () => {
    it('renders a native <time> element with the component marker by default', () => {
      const w = mountTime({ time: 0 });
      const el = w.find('time.sn-time');
      expect(el.exists()).toBe(true);
      expect(el.attributes('data-snui-component')).toBe('time');
    });

    it('renders a bare text node when text is set', () => {
      const w = mountTime({ time: 0, text: true });
      expect(w.find('time').exists()).toBe(false);
      expect(w.text()).not.toBe('');
    });

    it('defaults to the mount time when no time prop is passed', () => {
      const w = mountTime();
      expect(w.find('time.sn-time').text()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('type', () => {
    // new Date(y, m, d, h, min, s) is constructed in *local* time, so the
    // local-time assertions below hold on any machine time zone.
    const localTime = new Date(2020, 0, 2, 3, 4, 5);

    it('renders datetime by default', () => {
      const w = mountTime({ time: localTime });
      expect(w.find('time.sn-time').text()).toBe('2020-01-02 03:04:05');
    });

    it('renders date only with type="date"', () => {
      const w = mountTime({ time: localTime, type: 'date' });
      expect(w.find('time.sn-time').text()).toBe('2020-01-02');
    });

    it('renders datetime with type="datetime"', () => {
      const w = mountTime({ time: localTime, type: 'datetime' });
      expect(w.find('time.sn-time').text()).toBe('2020-01-02 03:04:05');
    });
  });

  describe('relative', () => {
    const base = 1729000000000;

    it('renders 「1 天前」 for a one-day-old time', () => {
      const w = mountTime({ time: base, to: base + 86400000, type: 'relative' });
      expect(w.find('time.sn-time').text()).toBe('1 天前');
    });

    it('renders plural days, hours and minutes in zh-CN', () => {
      expect(mountTime({ time: base, to: base + 10 * 86400000, type: 'relative' }).text()).toBe(
        '10 天前',
      );
      expect(mountTime({ time: base, to: base + 2 * 3600000, type: 'relative' }).text()).toBe(
        '2 小时前',
      );
      expect(mountTime({ time: base, to: base + 30 * 60000, type: 'relative' }).text()).toBe(
        '30 分钟前',
      );
    });

    it('renders 「x 后」 when the time lies ahead of `to`', () => {
      const w = mountTime({ time: base + 2 * 3600000, to: base, type: 'relative' });
      expect(w.find('time.sn-time').text()).toBe('2 小时后');
    });

    it('rounds to the nearest unit (90 seconds → 2 分钟)', () => {
      const w = mountTime({ time: base, to: base + 90 * 1000, type: 'relative' });
      expect(w.find('time.sn-time').text()).toBe('2 分钟前');
    });

    it('renders seconds for sub-minute distances', () => {
      const w = mountTime({ time: base, to: base + 45 * 1000, type: 'relative' });
      expect(w.find('time.sn-time').text()).toBe('45 秒前');
    });
  });

  describe('format', () => {
    it('formats with the custom pattern (UTC for determinism)', () => {
      const w = mountTime({ time: 0, format: 'yyyy-MM-dd hh:mm:ss', timeZone: 'UTC' });
      // 12-hour clock: hour 0 renders as 12.
      expect(w.find('time.sn-time').text()).toBe('1970-01-01 12:00:00');
    });

    it('supports quoted literals and month / weekday tokens', () => {
      expect(mountTime({ time: 0, format: "yyyy'年'M'月'd'日'", timeZone: 'UTC' }).text()).toBe(
        '1970年1月1日',
      );
      expect(mountTime({ time: 0, format: 'MMMM EEEE', timeZone: 'UTC' }).text()).toBe(
        '一月 星期四',
      );
    });
  });

  describe('unix', () => {
    it('interprets time / to as seconds when unix is set', () => {
      // 4320000 s = 50 days after the epoch.
      const w = mountTime({ time: 4320000, unix: true, timeZone: 'UTC' });
      expect(w.find('time.sn-time').text()).toBe('1970-02-20 00:00:00');
    });

    it('computes relative distances in seconds when unix is set', () => {
      // 50 days before the base point — the month ratio (1.64) reaches 1
      // first, so the distance renders in months like formatDistanceStrict.
      const w = mountTime({ time: 4320000, to: 8640000, unix: true, type: 'relative' });
      expect(w.find('time.sn-time').text()).toBe('2 个月前');
    });
  });

  describe('time-zone', () => {
    it('formats the same instant in the requested IANA zone', () => {
      expect(mountTime({ time: 0, timeZone: 'Asia/Shanghai' }).find('time.sn-time').text()).toBe(
        '1970-01-01 08:00:00',
      );
      expect(mountTime({ time: 0, timeZone: 'America/New_York' }).find('time.sn-time').text()).toBe(
        '1969-12-31 19:00:00',
      );
    });

    it('does not shift relative distances', () => {
      const w = mountTime({
        time: 0,
        to: 86400000,
        type: 'relative',
        timeZone: 'America/New_York',
      });
      expect(w.find('time.sn-time').text()).toBe('1 天前');
    });
  });
});
