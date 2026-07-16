const vibeCodingModalVisible = ref(false);

export function useVibeCodingModal() {
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
