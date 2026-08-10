export function useVibeCodingModal() {
  const vibeCodingModalVisible = useState('vibe-coding-modal-visible', () => false);
  /** Mount Dialog only after first open so PrimeVue stays out of the critical path. */
  const vibeCodingModalMounted = useState('vibe-coding-modal-mounted', () => false);

  function openVibeCodingModal() {
    vibeCodingModalMounted.value = true;
    vibeCodingModalVisible.value = true;
  }

  function closeVibeCodingModal() {
    vibeCodingModalVisible.value = false;
  }

  return {
    vibeCodingModalVisible,
    vibeCodingModalMounted,
    openVibeCodingModal,
    closeVibeCodingModal,
  };
}
