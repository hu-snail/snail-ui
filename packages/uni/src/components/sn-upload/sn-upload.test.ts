/**
 * sn-upload unit tests — uni-end file picker + uploader.
 *
 * Behaviour only (AGENTS.md §46): the picker / limit / oversize contract, the
 * beforeUpload / beforeRemove vetoes, the uploadMethod path, progress and the
 * abort-on-unmount guard. The runtime bridge is stubbed through `globalThis.uni`
 * so no mini-program API is needed. No rpx numbers in assertions.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnUpload from './sn-upload.vue';
import type { UploadFileItem } from './sn-upload-types';

interface StubRuntime {
  chooseImage?: ReturnType<typeof vi.fn>;
  chooseVideo?: ReturnType<typeof vi.fn>;
  chooseMessageFile?: ReturnType<typeof vi.fn>;
  uploadFile?: ReturnType<typeof vi.fn>;
  previewImage?: ReturnType<typeof vi.fn>;
}

const scope = globalThis as unknown as { uni?: StubRuntime };

function installRuntime(overrides: Partial<StubRuntime> = {}): StubRuntime {
  const runtime: StubRuntime = {
    chooseImage: vi.fn(),
    chooseVideo: vi.fn(),
    chooseMessageFile: vi.fn(),
    uploadFile: vi.fn(() => ({ abort: vi.fn() })),
    previewImage: vi.fn(),
    ...overrides,
  };
  scope.uni = runtime;
  return runtime;
}

afterEach(() => {
  delete scope.uni;
});

function mountUpload(props: Record<string, unknown> = {}) {
  return mount(SnUpload, { props: { fileList: [], ...props } });
}

const lastList = (w: ReturnType<typeof mount>): UploadFileItem[] =>
  (w.emitted('update:fileList')?.at(-1)?.[0] ?? []) as UploadFileItem[];

describe('sn-upload', () => {
  describe('structure', () => {
    it('renders the picker tile when the list is empty', () => {
      expect(mountUpload().find('.sn-upload__evoke').exists()).toBe(true);
    });

    it('renders one tile per file', () => {
      const w = mountUpload({
        fileList: [
          { uid: 1, url: 'a.png' },
          { uid: 2, url: 'b.png' },
        ],
      });
      expect(w.findAll('.sn-upload__file')).toHaveLength(2);
    });

    it('hides the picker when disabled', () => {
      const w = mountUpload({ disabled: true });
      expect(w.find('.sn-upload__evoke').exists()).toBe(false);
      expect(w.classes()).toContain('sn-upload--disabled');
    });

    it('hides the picker at the limit and shows the counter', () => {
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png' }], limit: 1 });
      expect(w.find('.sn-upload__evoke').exists()).toBe(false);
      expect(w.find('.sn-upload__limit').text()).toBe('1/1');
    });

    it('hides the counter when showLimitNum is off', () => {
      const w = mountUpload({ limit: 3, showLimitNum: false });
      expect(w.find('.sn-upload__limit').exists()).toBe(false);
    });

    it('marks a failed file', () => {
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png', status: 'fail' }] });
      expect(w.find('.sn-upload__file').classes()).toContain('sn-upload__file--fail');
    });

    it('renders the progress percentage while loading', () => {
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'loading', percent: 42 }],
      });
      expect(w.find('.sn-upload__progress').text()).toBe('42%');
    });

    it('hides the remove button when disabled', () => {
      const w = mountUpload({ disabled: true, fileList: [{ uid: 1, url: 'a.png' }] });
      expect(w.find('.sn-upload__remove').exists()).toBe(false);
    });
  });

  describe('picking', () => {
    it('emits chooseerror when the runtime is missing', async () => {
      const w = mountUpload();
      await w.find('.sn-upload__evoke').trigger('tap');
      expect(w.emitted('chooseerror')).toHaveLength(1);
    });

    it('adds the chosen image to the list', async () => {
      const runtime = installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'tmp.png', size: 100 }] });
        }),
      });
      const w = mountUpload({ autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(lastList(w)).toHaveLength(1));
      expect(runtime.chooseImage).toHaveBeenCalledTimes(1);
      expect(lastList(w)[0]?.url).toBe('tmp.png');
    });

    it('emits oversize instead of adding an oversized file', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'big.png', size: 5000 }] });
        }),
      });
      const w = mountUpload({ maxSize: 1000, autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(w.emitted('oversize')).toHaveLength(1));
      expect(w.emitted('update:fileList')).toBeUndefined();
    });

    it('does not exceed the limit', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({
            tempFiles: [
              { path: 'a.png', size: 1 },
              { path: 'b.png', size: 1 },
            ],
          });
        }),
      });
      const w = mountUpload({ limit: 1, autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(lastList(w)).toHaveLength(1));
    });

    it('keeps the picker closed when beforeChoose vetoes', async () => {
      const runtime = installRuntime();
      const w = mountUpload({ beforeChoose: () => false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await Promise.resolve();
      expect(runtime.chooseImage).not.toHaveBeenCalled();
    });

    it('keeps the file out of the list when beforeUpload vetoes', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'a.png', size: 1 }] });
        }),
      });
      const w = mountUpload({ autoUpload: false, beforeUpload: () => false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(scope.uni?.chooseImage).toHaveBeenCalled());
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('update:fileList')).toBeUndefined();
    });

    it('uses chooseMessageFile for accept="file"', async () => {
      const runtime = installRuntime({ chooseMessageFile: vi.fn() });
      const w = mountUpload({ accept: 'file', autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      expect(runtime.chooseMessageFile).toHaveBeenCalledTimes(1);
      expect(runtime.chooseImage).not.toHaveBeenCalled();
    });

    it('uses chooseVideo for accept="video"', async () => {
      const runtime = installRuntime({ chooseVideo: vi.fn() });
      const w = mountUpload({ accept: 'video', autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      expect(runtime.chooseVideo).toHaveBeenCalledTimes(1);
    });
  });

  describe('uploading', () => {
    it('reports progress through uploadMethod', async () => {
      const uploadMethod = vi.fn(async () => ({ ok: true }));
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        uploadMethod,
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      expect(uploadMethod).toHaveBeenCalledTimes(1);
      expect(w.emitted('success')).toHaveLength(1);
      expect(lastList(w).at(-1)?.status).toBe('success');
    });

    it('emits fail when uploadMethod rejects', async () => {
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        uploadMethod: async () => {
          throw new Error('nope');
        },
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      expect(w.emitted('fail')).toHaveLength(1);
      expect(lastList(w).at(-1)?.status).toBe('fail');
    });

    it('uploads through uni.uploadFile when no uploadMethod is given', async () => {
      const runtime = installRuntime({
        uploadFile: vi.fn(
          (options: { success?: (r: { statusCode: number; data: string }) => void }) => {
            options.success?.({ statusCode: 200, data: 'ok' });
            return { abort: vi.fn() };
          },
        ),
      });
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        action: '/api/upload',
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      expect(runtime.uploadFile).toHaveBeenCalledTimes(1);
      expect(w.emitted('success')).toHaveLength(1);
    });

    it('emits fail when the runtime cannot upload', async () => {
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png', status: 'pending' }] });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      expect(w.emitted('fail')).toHaveLength(1);
    });

    it('aborts every in-flight task on unmount', async () => {
      const abortSpy = vi.fn();
      installRuntime({
        uploadFile: vi.fn(() => ({ abort: abortSpy })),
      });
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        action: '/api/upload',
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      w.unmount();
      expect(abortSpy).toHaveBeenCalled();
    });
  });

  describe('removing', () => {
    it('removes a file and emits remove', async () => {
      const w = mountUpload({
        fileList: [
          { uid: 1, url: 'a.png' },
          { uid: 2, url: 'b.png' },
        ],
      });
      await w.findAll('.sn-upload__remove')[0]?.trigger('tap');
      expect(lastList(w)).toHaveLength(1);
      expect(w.emitted('remove')).toHaveLength(1);
    });

    it('keeps the file when beforeRemove vetoes', async () => {
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png' }], beforeRemove: () => false });
      await w.find('.sn-upload__remove').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('remove')).toBeUndefined();
    });
  });

  describe('preview', () => {
    it('opens the runtime preview for the tapped image', async () => {
      const runtime = installRuntime();
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png' }] });
      await w.find('.sn-upload__thumb').trigger('tap');
      await Promise.resolve();
      expect(runtime.previewImage).toHaveBeenCalledTimes(1);
    });

    it('skips the preview when beforePreview vetoes', async () => {
      const runtime = installRuntime();
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png' }], beforePreview: () => false });
      await w.find('.sn-upload__thumb').trigger('tap');
      await Promise.resolve();
      expect(runtime.previewImage).not.toHaveBeenCalled();
    });
  });

  /* ── Extended coverage: retries, transforms, payloads, progress wiring ── */

  describe('retry + payloads', () => {
    it('re-uploads a failed file on the next submit', async () => {
      const uploadMethod = vi
        .fn<(f: UploadFileItem) => Promise<string | Record<string, unknown>>>()
        .mockRejectedValueOnce(new Error('network down'))
        .mockResolvedValueOnce({ ok: true });
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        uploadMethod,
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      expect(lastList(w).at(-1)?.status).toBe('fail');
      await vm.submit();
      expect(lastList(w).at(-1)?.status).toBe('success');
      expect(uploadMethod).toHaveBeenCalledTimes(2);
    });

    it('transforms the chosen file when beforeUpload returns an object', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'raw.png', size: 10, name: 'raw' }] });
        }),
      });
      const w = mountUpload({
        autoUpload: false,
        beforeUpload: (file: UploadFileItem) => ({ ...file, name: 'renamed.png' }),
      });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(lastList(w)).toHaveLength(1));
      expect(lastList(w)[0]?.name).toBe('renamed.png');
      expect(lastList(w)[0]?.url).toBe('raw.png');
    });

    it('honours an async beforeUpload veto', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'a.png', size: 1 }] });
        }),
      });
      const w = mountUpload({ autoUpload: false, beforeUpload: async () => false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(scope.uni?.chooseImage).toHaveBeenCalled());
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('update:fileList')).toBeUndefined();
    });

    it('carries the rejected file and ceiling in the oversize payload', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'big.png', size: 9000 }] });
        }),
      });
      const w = mountUpload({ maxSize: 1000, autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(w.emitted('oversize')).toHaveLength(1));
      const payload = w.emitted('oversize')?.[0]?.[0] as { file: UploadFileItem; maxSize: number };
      expect(payload.file.url).toBe('big.png');
      expect(payload.maxSize).toBe(1000);
    });

    it('carries the removed file and the remaining list in the remove payload', async () => {
      const w = mountUpload({
        fileList: [
          { uid: 1, url: 'a.png' },
          { uid: 2, url: 'b.png' },
        ],
      });
      await w.findAll('.sn-upload__remove')[0]?.trigger('tap');
      const payload = w.emitted('remove')?.[0]?.[0] as {
        file: UploadFileItem;
        fileList: UploadFileItem[];
      };
      expect(payload.file.uid).toBe(1);
      expect(payload.fileList.map((f) => f.uid)).toEqual([2]);
    });

    it('emits chooseerror through the runtime fail callback', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { fail?: (e: unknown) => void }) => {
          options.fail?.(new Error('permission denied'));
        }),
      });
      const w = mountUpload();
      await w.find('.sn-upload__evoke').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('chooseerror')).toHaveLength(1);
    });

    it('auto-uploads right after choosing', async () => {
      const uploadMethod = vi.fn(async () => 'done');
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'a.png', size: 1 }] });
        }),
      });
      const w = mountUpload({ uploadMethod });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(w.emitted('success')).toHaveLength(1));
      expect(uploadMethod).toHaveBeenCalledTimes(1);
    });

    it('does nothing on submit while disabled', async () => {
      const uploadMethod = vi.fn(async () => 'done');
      const w = mountUpload({
        disabled: true,
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        uploadMethod,
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      await vm.submit();
      expect(uploadMethod).not.toHaveBeenCalled();
    });

    it('reports live progress from the runtime task (regression: percent stuck at 0)', async () => {
      let report: ((r: { progress: number }) => void) | undefined;
      installRuntime({
        uploadFile: vi.fn(() => ({
          abort: vi.fn(),
          onProgressUpdate: (cb: (r: { progress: number }) => void) => {
            report = cb;
          },
        })),
      });
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        action: '/api/upload',
      });
      const vm = w.vm as unknown as { submit(): Promise<void> };
      const submitting = vm.submit();
      await vi.waitFor(() => expect(report).toBeDefined());
      report?.({ progress: 55.4 });
      await vi.waitFor(() => expect(w.emitted('progress')).toHaveLength(1));
      const payload = w.emitted('progress')?.[0]?.[0] as { file: UploadFileItem; percent: number };
      expect(payload.percent).toBe(55);
      expect(payload.file.percent).toBe(55);
      expect(w.find('.sn-upload__progress').text()).toBe('55%');
      await submitting;
    });

    it('aborts one task through abort(task) and all through abort()', async () => {
      const abortOne = vi.fn();
      const task = { abort: abortOne };
      installRuntime({ uploadFile: vi.fn(() => task) });
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
        action: '/api/upload',
      });
      const vm = w.vm as unknown as {
        submit(): Promise<void>;
        abort(t?: unknown): void;
      };
      await vm.submit();
      vm.abort(task);
      expect(abortOne).toHaveBeenCalledTimes(1);
      vm.abort();
      expect(abortOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('presentation (extended)', () => {
    it('assigns monotonically increasing uids after the existing list', async () => {
      installRuntime({
        chooseImage: vi.fn((options: { success?: (r: { tempFiles: unknown[] }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'n.png', size: 1 }] });
        }),
      });
      const w = mountUpload({ fileList: [{ uid: 5, url: 'old.png' }], autoUpload: false });
      await w.find('.sn-upload__evoke').trigger('tap');
      await vi.waitFor(() => expect(lastList(w)).toHaveLength(2));
      expect(lastList(w)[1]?.uid).toBe(6);
    });

    it('requests one file per tap unless multiple is set', async () => {
      const singleRuntime = installRuntime();
      const single = mountUpload();
      await single.find('.sn-upload__evoke').trigger('tap');
      const singleOptions = singleRuntime.chooseImage?.mock.calls[0]?.[0] as { count: number };
      expect(singleOptions.count).toBe(1);

      const multiRuntime = installRuntime();
      const multi = mountUpload({ multiple: true, limit: 5 });
      await multi.find('.sn-upload__evoke').trigger('tap');
      const multiOptions = multiRuntime.chooseImage?.mock.calls[0]?.[0] as { count: number };
      expect(multiOptions.count).toBe(5);
    });

    it('forwards imageMode to the thumbnail', () => {
      const w = mountUpload({
        fileList: [{ uid: 1, url: 'a.png' }],
        imageMode: 'aspectFill',
      });
      expect(w.find('.sn-upload__thumb').attributes('mode')).toBe('aspectFill');
    });

    it('renders an empty thumb for a file without a url', () => {
      const w = mountUpload({ fileList: [{ uid: 1 }] });
      expect(w.find('.sn-upload__thumb--empty').exists()).toBe(true);
      expect(w.find('image.sn-upload__thumb').exists()).toBe(false);
    });

    it('labels the picker and remove buttons for assistive tech', () => {
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png', name: 'photo' }] });
      expect(w.find('.sn-upload__evoke').attributes('aria-label')).toBe('choose file');
      expect(w.find('.sn-upload__remove').attributes('aria-label')).toBe('remove photo');
      expect(w.find('.sn-upload__evoke').attributes('role')).toBe('button');
    });

    it('applies custom classes and style', () => {
      const w = mountUpload({
        customClass: 'my-upload',
        customStyle: 'padding: 4px;',
        customEvokeClass: 'my-evoke',
        customPreviewClass: 'my-preview',
        fileList: [{ uid: 1, url: 'a.png' }],
      });
      expect(w.classes()).toContain('my-upload');
      expect(w.attributes('style')).toContain('padding: 4px');
      expect(w.find('.sn-upload__evoke').classes()).toContain('my-evoke');
      expect(w.find('.sn-upload__file').classes()).toContain('my-preview');
    });

    it('reflects an externally replaced fileList', async () => {
      const w = mountUpload({ fileList: [{ uid: 1, url: 'a.png' }] });
      await w.setProps({ fileList: [{ uid: 9, url: 'new.png' }] });
      expect(w.findAll('.sn-upload__file')).toHaveLength(1);
      expect(w.find('.sn-upload__thumb').attributes('src')).toBe('new.png');
    });

    it('marks the root as a labelled group', () => {
      const w = mountUpload();
      expect(w.attributes('role')).toBe('group');
      expect(w.attributes('aria-label')).toBe('upload');
      expect(w.attributes('data-snui-component')).toBe('upload');
    });
  });
});

describe('sn-upload (picker variants and runtime failure)', () => {
  it('picks files through uni.chooseMessageFile for accept="file"', async () => {
    const runtime = installRuntime({
      chooseMessageFile: vi.fn(
        (options: { success?: (r: { tempFiles: Array<{ path: string; size: number }> }) => void }) => {
          options.success?.({ tempFiles: [{ path: 'doc.pdf', size: 128 }] });
        },
      ),
    });
    const w = mountUpload({ accept: 'file' });
    await w.find('.sn-upload__evoke').trigger('tap');
    await vi.waitFor(() => expect(runtime.chooseMessageFile).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(lastList(w)).toHaveLength(1));
    expect(lastList(w)[0]?.url).toBe('doc.pdf');
  });

  it('picks a video through uni.chooseVideo for accept="video"', async () => {
    const runtime = installRuntime({
      chooseVideo: vi.fn(
        (options: { success?: (r: { tempFilePath: string; size: number }) => void }) => {
          options.success?.({ tempFilePath: 'clip.mp4', size: 4096 });
        },
      ),
    });
    const w = mountUpload({ accept: 'video' });
    await w.find('.sn-upload__evoke').trigger('tap');
    await vi.waitFor(() => expect(runtime.chooseVideo).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(lastList(w)).toHaveLength(1));
    expect(lastList(w)[0]?.url).toBe('clip.mp4');
  });

  it('emits fail with the runtime error when uni.uploadFile fails', async () => {
    const runtime = installRuntime({
      uploadFile: vi.fn((options: { fail?: (error: unknown) => void }) => {
        options.fail?.(new Error('network down'));
        return { abort: vi.fn() };
      }),
    });
    const w = mountUpload({
      fileList: [{ uid: 1, url: 'a.png', status: 'pending' }],
      action: '/api/upload',
    });
    const vm = w.vm as unknown as { submit(): Promise<void> };
    await vm.submit();
    await vi.waitFor(() => expect(w.emitted('fail')).toHaveLength(1));
    expect(runtime.uploadFile).toHaveBeenCalledTimes(1);
    expect(lastList(w).at(-1)?.status).toBe('fail');
    const payload = w.emitted('fail')?.[0]?.[0] as { error: unknown };
    expect((payload.error as Error).message).toBe('network down');
  });
});
