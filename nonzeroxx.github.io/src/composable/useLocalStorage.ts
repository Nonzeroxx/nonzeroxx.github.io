import { onMounted, onUnmounted, ref, watch } from "vue";

export function useLocalStorage(key: string, initialValue: string) {
  const storedValue = localStorage.getItem(key);
  const data = ref(storedValue ? storedValue : initialValue);

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, newValue);
    },
    { deep: true }
  );

  const handleStorageChange = (event: StorageEvent) => {
    if(event.key === key && event.newValue !== null) {
        data.value = event.newValue;
    }
  }

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange);
  });
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
  })

  return data;
}
