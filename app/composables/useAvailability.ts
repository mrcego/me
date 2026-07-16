/** Official contract start date — local midnight. */
export const AVAILABILITY_START = new Date(2026, 7, 10);

export function isImmediatelyAvailable(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today >= AVAILABILITY_START;
}

export function useAvailability() {
  const showAnnouncement = computed(() => !isImmediatelyAvailable());

  return {
    showAnnouncement,
  };
}
