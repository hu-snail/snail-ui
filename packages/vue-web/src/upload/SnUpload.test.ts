/**
 * SnUpload unit tests — web-end file upload.
 *
 * Behavior-focused (AGENTS.md §46): pick → list, multiple, max cap,
 * remove, beforeUpload reject, customRequest success/failure status
 * machine, disabled / readonly, image thumbnails (objectURL lifecycle),
 * drag & drop, manual submit (defaultUpload: false).
 *
 * File picks are simulated by defining `files` on the hidden native input
 * and dispatching a bubbling `change` event (happy-dom has no picker);
 * drops by dispatching `dragover` / `drop` with a `dataTransfer` payload.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SnUpload from './SnUpload.vue'
import type { SnUploadFile } from './sn-upload-types'

/** Build a browser File (content length drives the size column). */
function makeFile(name: string, content = 'hello'): File {
  return new File([content], name, { type: 'text/plain' })
}

/** Mount helper — keeps tests focused on props. */
function mountUpload(props: Record<string, unknown> = {}) {
  return mount(SnUpload, { props })
}

/**
 * Simulate a native picker commit: replace the hidden input's `files`
 * with the given list, then dispatch a bubbling `change` event.
 */
async function pickFiles(wrapper: ReturnType<typeof mountUpload>, files: File[]): Promise<void> {
  const input = wrapper.get('input[type="file"]').element as HTMLInputElement
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await nextTick()
  await Promise.resolve()
}

/** Dispatch a bubbling drag event carrying a `dataTransfer.files` payload. */
function dispatchDragEvent(
  wrapper: ReturnType<typeof mountUpload>,
  type: 'dragover' | 'drop' | 'dragleave',
  files: File[],
): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', { value: { files }, configurable: true })
  wrapper.get('.sn-upload').element.dispatchEvent(event)
}

/** Statuses of the rendered list rows, in order. */
function rowStatuses(wrapper: ReturnType<typeof mountUpload>): string[] {
  return wrapper.findAll('.sn-upload__item').map(row => row.attributes('data-status'))
}

describe('SnUpload', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  /* ───── trigger + list rendering ───── */

  it('renders the default trigger button with a real svg glyph', () => {
    const wrapper = mountUpload()
    const trigger = wrapper.find('.sn-upload__trigger')
    expect(trigger.exists()).toBe(true)
    expect(trigger.text()).toContain('点击上传')
    expect(trigger.find('svg').exists()).toBe(true)
  })

  it('adds a picked file to the list and emits change / update:fileList', async () => {
    const wrapper = mountUpload()
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
    expect(wrapper.get('.sn-upload__name').text()).toBe('a.txt')
    const change = wrapper.emitted('change')
    expect(change?.at(-1)).toHaveLength(1)
    const [list] = change!.at(-1) as [SnUploadFile[]]
    expect(list[0]?.name).toBe('a.txt')
    const synced = wrapper.emitted('update:fileList')
    expect(synced?.at(-1)).toEqual([[list[0]]])
  })

  it('shows the file size alongside the name', async () => {
    const wrapper = mountUpload()
    await pickFiles(wrapper, [makeFile('a.txt', 'x'.repeat(2048))])
    expect(wrapper.get('.sn-upload__size').text()).toBe('2.0 KB')
  })

  it('flips the status straight to done without a customRequest (no network)', async () => {
    const wrapper = mountUpload()
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(rowStatuses(wrapper)).toEqual(['done'])
  })

  it('renders no list when showFileList is false', async () => {
    const wrapper = mountUpload({ showFileList: false })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.find('.sn-upload__list').exists()).toBe(false)
    // change still fires (add + done flip) — hiding the list does not
    // suppress state.
    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  /* ───── multiple / accept ───── */

  it('keeps only the first file when multiple is off', async () => {
    const wrapper = mountUpload({ multiple: false })
    await pickFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
    expect(wrapper.get('.sn-upload__name').text()).toBe('a.txt')
  })

  it('adds every picked file when multiple is on', async () => {
    const wrapper = mountUpload({ multiple: true })
    await pickFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    const names = wrapper.findAll('.sn-upload__name').map(n => n.text())
    expect(names).toEqual(['a.txt', 'b.txt'])
  })

  it('forwards accept to the hidden input and clears it when empty', () => {
    const withAccept = mountUpload({ accept: '.png,.jpg' })
    expect(withAccept.get('input[type="file"]').attributes('accept')).toBe('.png,.jpg')

    const withoutAccept = mountUpload()
    expect(withoutAccept.get('input[type="file"]').attributes('accept')).toBeUndefined()
  })

  /* ───── max cap ───── */

  it('hides the trigger once max is reached', async () => {
    const wrapper = mountUpload({ max: 1 })
    expect(wrapper.find('.sn-upload__trigger').exists()).toBe(true)
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
    expect(wrapper.find('.sn-upload__trigger').exists()).toBe(false)
  })

  it('drops files past the max cap', async () => {
    const wrapper = mountUpload({ multiple: true, max: 2 })
    await pickFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(2)
    // Removing one frees a slot — the trigger comes back.
    await wrapper.findAll('.sn-upload__remove')[0]!.trigger('click')
    expect(wrapper.find('.sn-upload__trigger').exists()).toBe(true)
  })

  /* ───── remove ───── */

  it('removes a file via the × button and emits remove', async () => {
    const wrapper = mountUpload({ multiple: true })
    await pickFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    await wrapper.findAll('.sn-upload__remove')[0]!.trigger('click')
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
    expect(wrapper.get('.sn-upload__name').text()).toBe('b.txt')
    const remove = wrapper.emitted('remove')
    expect(remove).toHaveLength(1)
    expect((remove![0] as [SnUploadFile])[0].name).toBe('a.txt')
    const change = wrapper.emitted('change')
    expect((change!.at(-1) as [SnUploadFile[]])[0]).toHaveLength(1)
  })

  /* ───── beforeUpload ───── */

  it('keeps a file out when beforeUpload returns false', async () => {
    const wrapper = mountUpload({ onBeforeUpload: () => false })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(0)
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('awaits an async beforeUpload before listing the file', async () => {
    const wrapper = mountUpload({ onBeforeUpload: () => Promise.resolve(true) })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
  })

  it('treats a throwing beforeUpload as a rejection', async () => {
    const wrapper = mountUpload({
      onBeforeUpload: () => { throw new Error('gate failed') },
    })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(0)
  })

  /* ───── customRequest status machine ───── */

  it('drives uploading → done from a resolving customRequest', async () => {
    let observedStatus: string | undefined
    const wrapper = mountUpload({
      customRequest: (file: SnUploadFile) => {
        observedStatus = file.status
        return Promise.resolve()
      },
    })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(observedStatus).toBe('uploading')
    expect(rowStatuses(wrapper)).toEqual(['done'])
  })

  it('drives uploading → error from a rejecting customRequest', async () => {
    const wrapper = mountUpload({
      customRequest: () => Promise.reject(new Error('boom')),
    })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(rowStatuses(wrapper)).toEqual(['error'])
    // The entry stays listed — failure does not silently drop the file.
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
  })

  it('passes the current list snapshot to customRequest', async () => {
    const seen: SnUploadFile[][] = []
    const wrapper = mountUpload({
      multiple: true,
      customRequest: (_file: SnUploadFile, list: SnUploadFile[]) => {
        seen.push([...list])
        return Promise.resolve()
      },
    })
    await pickFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
    expect(seen[1]?.map(f => f.name)).toEqual(['a.txt', 'b.txt'])
  })

  it('does not start an upload while defaultUpload is false', async () => {
    const customRequest = vi.fn(() => Promise.resolve())
    const wrapper = mountUpload({ defaultUpload: false, customRequest })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(rowStatuses(wrapper)).toEqual(['pending'])
    expect(customRequest).not.toHaveBeenCalled()
  })

  it('submits a pending entry manually through the exposed submit()', async () => {
    const customRequest = vi.fn(() => Promise.resolve())
    const wrapper = mountUpload({ defaultUpload: false, customRequest })
    await pickFiles(wrapper, [makeFile('a.txt')])
    await wrapper.vm.submit()
    expect(customRequest).toHaveBeenCalledTimes(1)
    expect(rowStatuses(wrapper)).toEqual(['done'])
  })

  /* ───── disabled / readonly ───── */

  it('renders no trigger and no remove buttons when disabled', async () => {
    const wrapper = mountUpload({ disabled: true })
    expect(wrapper.find('.sn-upload__trigger').exists()).toBe(false)
    expect(wrapper.classes()).toContain('sn-upload--disabled')

    // Drops are ignored while disabled.
    dispatchDragEvent(wrapper, 'drop', [makeFile('a.txt')])
    await nextTick()
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(0)
  })

  it('renders no trigger and no remove buttons when readonly', async () => {
    const wrapper = mountUpload({ readonly: true })
    expect(wrapper.find('.sn-upload__trigger').exists()).toBe(false)
    expect(wrapper.findAll('.sn-upload__remove')).toHaveLength(0)
    expect(wrapper.classes()).toContain('sn-upload--readonly')
  })

  /* ───── image thumbnails (objectURL lifecycle, §41) ───── */

  it('creates an objectURL thumbnail in image list type', async () => {
    const createSpy = vi.spyOn(URL, 'createObjectURL')
    const wrapper = mountUpload({ listType: 'image' })
    await pickFiles(wrapper, [makeFile('a.png')])
    expect(createSpy).toHaveBeenCalledTimes(1)
    const img = wrapper.get('.sn-upload__thumb')
    expect(img.attributes('src')).toMatch(/^blob:/)
    createSpy.mockRestore()
  })

  it('revokes the objectURL when the file is removed', async () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const wrapper = mountUpload({ listType: 'image' })
    await pickFiles(wrapper, [makeFile('a.png')])
    await wrapper.get('.sn-upload__remove').trigger('click')
    expect(revokeSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('remove')).toHaveLength(1)
    revokeSpy.mockRestore()
  })

  it('revokes every objectURL on unmount (§41 dispose)', async () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const wrapper = mountUpload({ listType: 'image', multiple: true })
    await pickFiles(wrapper, [makeFile('a.png'), makeFile('b.png')])
    wrapper.unmount()
    expect(revokeSpy).toHaveBeenCalledTimes(2)
    revokeSpy.mockRestore()
  })

  it('draws no thumbnail in text list type and creates no objectURL', async () => {
    const createSpy = vi.spyOn(URL, 'createObjectURL')
    const wrapper = mountUpload({ listType: 'text' })
    await pickFiles(wrapper, [makeFile('a.txt')])
    expect(wrapper.find('.sn-upload__thumb').exists()).toBe(false)
    expect(createSpy).not.toHaveBeenCalled()
    createSpy.mockRestore()
  })

  /* ───── drag & drop ───── */

  it('highlights on dragover and clears on dragleave', async () => {
    const wrapper = mountUpload()
    dispatchDragEvent(wrapper, 'dragover', [])
    await nextTick()
    expect(wrapper.classes()).toContain('sn-upload--dragging')
    dispatchDragEvent(wrapper, 'dragleave', [])
    await nextTick()
    expect(wrapper.classes()).not.toContain('sn-upload--dragging')
  })

  it('adds dropped files to the list', async () => {
    const wrapper = mountUpload({ multiple: true })
    dispatchDragEvent(wrapper, 'dragover', [])
    dispatchDragEvent(wrapper, 'drop', [makeFile('a.txt'), makeFile('b.txt')])
    await nextTick()
    await Promise.resolve()
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(2)
    expect(wrapper.classes()).not.toContain('sn-upload--dragging')
  })

  it('ignores drops past the max cap', async () => {
    const wrapper = mountUpload({ multiple: true, max: 1 })
    dispatchDragEvent(wrapper, 'drop', [makeFile('a.txt'), makeFile('b.txt')])
    await nextTick()
    await Promise.resolve()
    expect(wrapper.findAll('.sn-upload__item')).toHaveLength(1)
  })

  /* ───── trigger slot ───── */

  it('renders the custom trigger slot instead of the default body', () => {
    const wrapper = mount(SnUpload, {
      slots: { trigger: '<i data-testid="custom-trigger">选择文件</i>' },
    })
    expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true)
    expect(wrapper.get('.sn-upload__trigger').text()).not.toContain('点击上传')
  })
})
