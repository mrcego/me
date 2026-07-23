export function useVibeCodingModal() {
  const vibeCodingModalVisible = useState('vibe-coding-modal-visible', () => false);

  function openVibeCodingModal() {
    vibeCodingModalVisible.value = true;
  }

  function closeVibeCodingModal() {
    vibeCodingModalVisible.value = false;
  }

  return {
    vibeCodingModalVisible,
    openVibeCodingModal,
    closeVibeCodingModal,
  };
}
