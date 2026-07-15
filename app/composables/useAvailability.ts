/** Official contract start date — local midnight. */
export const AVAILABILITY_START = new Date(2026, 7, 10);

const DISMISS_STORAGE_KEY = 'portfolio:availability-announcement-dismissed';

const announcementVisible = ref(false);
const announcementClosed = ref(false);

export function isImmediatelyAvailable(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today >= AVAILABILITY_START;
}

export function useAvailability() {
  const heroTaglineKey = computed(() =>
    isImmediatelyAvailable() ? 'hero.tagline.immediate' : 'hero.tagline.fromDate',
  );

  const showAnnouncement = computed(() => !isImmediatelyAvailable());

  const showReopenHint = computed(
    () =>
      showAnnouncement.value &&
      !announcementVisible.value &&
      (announcementClosed.value || isAnnouncementDismissed()),
  );

  function isAnnouncementDismissed() {
    if (!import.meta.client) return true;
    return localStorage.getItem(DISMISS_STORAGE_KEY) === '1';
  }

  function dismissAnnouncement() {
    if (import.meta.client) {
      localStorage.setItem(DISMISS_STORAGE_KEY, '1');
    }
  }

  function openAnnouncement() {
    if (!showAnnouncement.value) return;
    announcementVisible.value = true;
  }

  function markAnnouncementClosed() {
    announcementClosed.value = true;
  }

  return {
    heroTaglineKey,
    showAnnouncement,
    showReopenHint,
    announcementVisible,
    isAnnouncementDismissed,
    dismissAnnouncement,
    openAnnouncement,
    markAnnouncementClosed,
  };
}
