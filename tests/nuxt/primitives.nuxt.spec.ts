import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import AppBadge from '~/components/primitives/AppBadge.vue';
import AppButton from '~/components/primitives/AppButton.vue';
import AppModal from '~/components/primitives/AppModal.vue';
import AppSectionHeader from '~/components/primitives/AppSectionHeader.vue';
import AppSurface from '~/components/primitives/AppSurface.vue';

describe('Atomic Primitives (Design System)', () => {
  describe('AppSurface', () => {
    it('renders default surface-evidence variant with 2xl rounded class', async () => {
      const wrapper = await mountSuspended(AppSurface, {
        slots: { default: () => 'Surface Content' },
      });
      expect(wrapper.text()).toContain('Surface Content');
      expect(wrapper.classes()).toContain('surface-evidence');
      expect(wrapper.classes()).toContain('rounded-2xl');
      wrapper.unmount();
    });

    it('supports custom variants and interactive/glow states', async () => {
      const wrapper = await mountSuspended(AppSurface, {
        props: {
          variant: 'glass',
          interactive: true,
          glow: true,
          rounded: 'xl',
        },
      });
      expect(wrapper.classes()).toContain('glass');
      expect(wrapper.classes()).toContain('rounded-xl');
      expect(wrapper.classes()).toContain('hover:border-primary/40');
      expect(wrapper.classes()).toContain('ring-1');
      wrapper.unmount();
    });

    it('renders custom HTML element via as prop', async () => {
      const wrapper = await mountSuspended(AppSurface, {
        props: { as: 'section' },
      });
      expect(wrapper.element.tagName.toLowerCase()).toBe('section');
      wrapper.unmount();
    });
  });

  describe('AppButton', () => {
    it('renders standard button element with primary variant', async () => {
      const wrapper = await mountSuspended(AppButton, {
        slots: { default: () => 'Click Me' },
      });
      expect(wrapper.element.tagName.toLowerCase()).toBe('button');
      expect(wrapper.text()).toContain('Click Me');
      expect(wrapper.classes()).toContain('bg-primary');
      wrapper.unmount();
    });

    it('renders as NuxtLink when to prop is provided', async () => {
      const wrapper = await mountSuspended(AppButton, {
        props: { to: '/es/' },
        slots: { default: () => 'Navigate' },
      });
      expect(wrapper.element.tagName.toLowerCase()).toBe('a');
      expect(wrapper.attributes('href')).toBe('/es/');
      wrapper.unmount();
    });

    it('renders external link when href is provided', async () => {
      const wrapper = await mountSuspended(AppButton, {
        props: { href: 'https://github.com/mrcego', target: '_blank' },
        slots: { default: () => 'GitHub' },
      });
      expect(wrapper.element.tagName.toLowerCase()).toBe('a');
      expect(wrapper.attributes('href')).toBe('https://github.com/mrcego');
      expect(wrapper.attributes('target')).toBe('_blank');
      expect(wrapper.attributes('rel')).toContain('noopener noreferrer');
      wrapper.unmount();
    });

    it('handles disabled and loading states', async () => {
      const wrapper = await mountSuspended(AppButton, {
        props: { disabled: true, loading: true },
        slots: { default: () => 'Submitting' },
      });
      expect(wrapper.attributes('disabled')).toBeDefined();
      expect(wrapper.classes()).toContain('opacity-50');
      wrapper.unmount();
    });
  });

  describe('AppBadge', () => {
    it('renders default muted badge', async () => {
      const wrapper = await mountSuspended(AppBadge, {
        slots: { default: () => 'Vue 3' },
      });
      expect(wrapper.text()).toContain('Vue 3');
      expect(wrapper.classes()).toContain('text-muted');
      wrapper.unmount();
    });

    it('supports primary variant and interactive mode', async () => {
      const wrapper = await mountSuspended(AppBadge, {
        props: { variant: 'primary', interactive: true, size: 'sm' },
        slots: { default: () => 'Nuxt' },
      });
      expect(wrapper.classes()).toContain('text-primary');
      expect(wrapper.classes()).toContain('hover:border-primary');
      expect(wrapper.classes()).toContain('px-2.5');
      wrapper.unmount();
    });

    it('renders label prop and dot indicator', async () => {
      const wrapper = await mountSuspended(AppBadge, {
        props: { label: 'AVAILABLE', variant: 'dot' },
      });
      expect(wrapper.text()).toContain('AVAILABLE');
      expect(wrapper.classes()).toContain('text-emerald-400');
      expect(wrapper.find('span.bg-emerald-400').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('AppSectionHeader', () => {
    it('renders eyebrow, title and description with left alignment', async () => {
      const wrapper = await mountSuspended(AppSectionHeader, {
        props: {
          eyebrow: '01 // ARCHITECTURE',
          title: 'Senior Engineering',
          description: '13+ years building high performance apps',
        },
      });
      expect(wrapper.text()).toContain('01 // ARCHITECTURE');
      expect(wrapper.text()).toContain('Senior Engineering');
      expect(wrapper.text()).toContain('13+ years building high performance apps');
      expect(wrapper.classes()).toContain('text-left');
      wrapper.unmount();
    });

    it('renders highlighted text gradient when highlight prop is passed', async () => {
      const wrapper = await mountSuspended(AppSectionHeader, {
        props: {
          title: 'Fullstack Mastery',
          highlight: 'Mastery',
          align: 'center',
        },
      });
      expect(wrapper.find('.text-gradient-primary').text()).toBe('Mastery');
      expect(wrapper.classes()).toContain('text-center');
      wrapper.unmount();
    });
  });

  describe('AppModal', () => {
    it('does not render modal content when modelValue is false', async () => {
      const wrapper = await mountSuspended(AppModal, {
        props: { modelValue: false, teleport: false },
      });
      expect(wrapper.find('.app-modal-mask').exists()).toBe(false);
      wrapper.unmount();
    });

    it('renders modal when modelValue is true and emits close on button click', async () => {
      const wrapper = await mountSuspended(AppModal, {
        props: {
          modelValue: true,
          title: 'Design System Modal',
          description: 'Modal description text',
          teleport: false,
        },
        slots: {
          default: () => 'Modal Body Content',
        },
      });

      expect(wrapper.find('.app-modal-mask').exists()).toBe(true);
      expect(wrapper.text()).toContain('Design System Modal');
      expect(wrapper.text()).toContain('Modal Body Content');

      const closeBtn = wrapper.find('button[aria-label="Cerrar modal"]');
      expect(closeBtn.exists()).toBe(true);
      await closeBtn.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
      expect(wrapper.emitted('close')).toBeDefined();

      wrapper.unmount();
    });
  });
});
