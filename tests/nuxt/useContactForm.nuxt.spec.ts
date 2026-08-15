import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { useContactForm } from '~/composables/domain/useContactForm';

async function mountForm() {
  let api!: ReturnType<typeof useContactForm>;
  await mountSuspended(
    defineComponent({
      setup() {
        api = useContactForm();
        return {};
      },
      template: '<div />',
    }),
  );
  return api;
}

describe('useContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects an empty form (bad path)', async () => {
    const form = await mountForm();
    expect(form.validateForm()).toBe(false);
    expect(form.errors.name).toBeTruthy();
    expect(form.errors.email).toBeTruthy();
    expect(form.errors.subject).toBeTruthy();
    expect(form.errors.message).toBeTruthy();
  });

  it('rejects invalid email and too-short fields (bad path)', async () => {
    const form = await mountForm();
    form.formData.name = 'A';
    form.formData.email = 'not-an-email';
    form.formData.subject = 'Hi';
    form.formData.message = 'Short';
    expect(form.validateForm()).toBe(false);
    expect(form.errors.name).toBeTruthy();
    expect(form.errors.email).toBeTruthy();
    expect(form.errors.subject).toBeTruthy();
    expect(form.errors.message).toBeTruthy();
  });

  it('accepts a valid payload (happy path validation)', async () => {
    const form = await mountForm();
    form.formData.name = 'Cesar Gomez';
    form.formData.email = 'cesar@example.com';
    form.formData.subject = 'Hello there';
    form.formData.message = 'This is a long enough message.';
    expect(form.validateForm()).toBe(true);
    expect(Object.values(form.errors).every((e) => !e)).toBe(true);
  });

  it('resets fields and errors', async () => {
    const form = await mountForm();
    form.formData.name = 'Cesar';
    form.errors.name = 'x';
    form.resetForm();
    expect(form.formData.name).toBe('');
    expect(form.errors.name).toBe('');
  });

  it('submits via Netlify when provider is netlify (happy path)', async () => {
    const form = await mountForm();
    const config = useRuntimeConfig();
    config.public.contactProvider = 'netlify';

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));

    form.formData.name = 'Cesar Gomez';
    form.formData.email = 'cesar@example.com';
    form.formData.subject = 'Hello there';
    form.formData.message = 'This is a long enough message.';

    expect(await form.submitForm()).toBe(true);
    expect(form.submitSuccess.value).toBe(true);
    expect(form.dispatchStage.value).toBe('confirmed');
    expect(form.txReceipt.value).toMatch(/^TX-2026-/);
    expect(fetch).toHaveBeenCalled();
  });

  it('surfaces Netlify HTTP failures (bad path)', async () => {
    const form = await mountForm();
    useRuntimeConfig().public.contactProvider = 'netlify';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    form.formData.name = 'Cesar Gomez';
    form.formData.email = 'cesar@example.com';
    form.formData.subject = 'Hello there';
    form.formData.message = 'This is a long enough message.';

    expect(await form.submitForm()).toBe(false);
    expect(form.submitError.value).toBeTruthy();
    expect(form.submitSuccess.value).toBe(false);
  });

  it('surfaces Netlify network errors (bad path)', async () => {
    const form = await mountForm();
    useRuntimeConfig().public.contactProvider = 'netlify';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    form.formData.name = 'Cesar Gomez';
    form.formData.email = 'cesar@example.com';
    form.formData.subject = 'Hello there';
    form.formData.message = 'This is a long enough message.';

    expect(await form.submitForm()).toBe(false);
    expect(form.submitError.value).toBeTruthy();
    expect(form.isSubmitting.value).toBe(false);
  });

  it('returns false without submitting when validation fails (bad path)', async () => {
    const form = await mountForm();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    expect(await form.submitForm()).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('uses mailto when contact provider is not netlify', async () => {
    const form = await mountForm();
    useRuntimeConfig().public.contactProvider = 'mailto';
    const locationMock = { href: '' };
    vi.stubGlobal('location', locationMock);

    form.formData.name = 'Cesar Gomez';
    form.formData.email = 'cesar@example.com';
    form.formData.subject = 'Hello there';
    form.formData.message = 'This is a long enough message.';

    expect(await form.submitForm()).toBe(true);
    expect(locationMock.href).toMatch(/^mailto:cesargomezh90@gmail.com/);
    expect(form.submitSuccess.value).toBe(true);
  });
});
