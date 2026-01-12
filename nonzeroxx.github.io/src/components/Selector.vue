<script setup lang="ts">
import { buildLog } from "@/utils/Log";
import { Icon } from "@iconify/vue";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";

const log = buildLog(true);

interface Item {
  icon?: string;
  label: string;
  value: string;
}
const props = defineProps<{
  items: Item[];
  modelValue?: string | null;
  placement?: "column" | "row";
}>();

const isCollapsed = ref(true);

const direction = computed(() => {
  if (props.placement === "column") {
    return "flex-direction: column-reverse";
  } else if (props.placement === "row") {
    return "flex-direction: row";
  } else {
    return null;
  }
});

const emit = defineEmits<{
  (e: "select", v: Item): void;
}>();

const selectItem = (item: Item) => {
  log("select item");
  emit("select", item);
  isCollapsed.value = !isCollapsed.value;
};

const isSelected = (item: Item) => {
  return props?.modelValue === item.value;
};

const itemsRef = ref<any>(null); // 或者 ref<ComponentPublicInstance | null>(null)

const handleClick = (e: MouseEvent) => {
  if (!itemsRef.value) return;
  
  // 使用 itemsRef.value.$el 来获取真实的 DOM 元素
  const el = itemsRef.value.$el || itemsRef.value;
  
  if (el && !el.contains(e.target as Node)) {
    isCollapsed.value = true;
  }
};

// watchEffect(() => {
//   log("selector collapsed: ", isCollapsed.value)
// })

onMounted(() => {
  log("selector props: ", props);
  log("selector collapsed: ", isCollapsed.value)
  window.addEventListener("click", handleClick);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClick);
});
</script>

<template>
  <TransitionGroup
    ref="itemsRef"
    tag="ul"
    name="list"
    class="selector-box"
    :style="direction"
  >
    <li
      v-for="item in items"
      v-show="
        placement === undefined || modelValue === item.value || placement !== undefined && !isCollapsed
      "
      :key="item.value"
      @click="selectItem(item)"
      class="selector-item"
      :class="{
        selected: isSelected(item) && (placement === undefined || !isCollapsed),
      }"
    >
      <Icon v-if="item.icon !== null" :icon="item.icon!" class="global-icon" />
      {{ item.label }}
    </li>
  </TransitionGroup>
</template>

<style scoped>
.selector-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border-radius: 8px;
  border: 1px solid var(--global-header-border-bottom-color);
  overflow: hidden;

  .selector-item {
    display: flex;
    gap: 10px;
    padding: 8px 12px;
    align-items: center;

    &:not(:last-child) {
      border-right: 1px solid var(--global-header-border-bottom-color);
    }
    &.selected {
      background-color: var(--selector-selected-background-color);
      backdrop-filter: blur(10px) saturate(1.2);
      box-shadow: 0 0 10px var(--selector-selected-background-color);
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1), transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.list-leave-active {
  position: static; 
}

.list-move {
  transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
