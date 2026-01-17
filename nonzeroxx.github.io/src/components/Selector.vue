<script setup lang="ts">
import { buildLog } from "@/utils/Log";
import { Icon } from "@iconify/vue";
import { computed, onMounted, onUnmounted, ref } from "vue";

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

// 修改点 1: 使用 class 来控制方向，而不是 style
const containerClass = computed(() => {
  return props.placement === "column" ? "mode-column" : "mode-row";
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

const itemsRef = ref<any>(null);

const handleClick = (e: MouseEvent) => {
  if (!itemsRef.value) return;
  const el = itemsRef.value.$el || itemsRef.value;
  if (el && !el.contains(e.target as Node)) {
    isCollapsed.value = true;
  }
};

onMounted(() => {
  log("selector props: ", props);
  log("selector collapsed: ", isCollapsed.value);
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
    :class="[containerClass, { 'is-collapsed': isCollapsed }]" 
  >
    <li
      v-for="item in items"
      v-show="
        placement === undefined ||
        modelValue === item.value ||
        (placement !== undefined && !isCollapsed)
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
  /* 修改点 2: 移除默认的 align-items: center，在具体的模式中定义 */
  width: fit-content;
  border-radius: 8px;
  border: 1px solid var(--global-header-border-bottom-color);
  overflow: hidden;
  padding: 0; /* 确保 ul 没有默认 padding */
  margin: 0;  /* 确保 ul 没有默认 margin */
  list-style: none;
}

/* --- Row 模式样式 (默认) --- */
.selector-box.mode-row {
  flex-direction: row;
  align-items: center;
}

.selector-box.mode-row .selector-item:not(:last-child) {
  border-right: 1px solid var(--global-header-border-bottom-color);
}

/* --- Column 模式样式 --- */
.selector-box.mode-column {
  flex-direction: column-reverse;
  align-items: stretch;
}

/* 核心修改：只有在【非折叠】状态下，才给非最后一个元素加边框 */
.selector-box.mode-column:not(.is-collapsed) .selector-item:not(:last-child) {
  border-right: none;
  border-top: 1px solid var(--global-header-border-bottom-color);
}

/* 同理，Row 模式也最好加上这个限制，防止未来 row 模式下选中非末尾元素时出现多余边框 
   (虽然 row 模式通常右边框问题不明显，但这样更严谨)
*/
.selector-box.mode-row:not(.is-collapsed) .selector-item:not(:last-child) {
  border-right: 1px solid var(--global-header-border-bottom-color);
}

/* 兜底保障：如果是折叠状态，强制移除所有可能的边框 
   这样无论选中的是第几个，只要是折叠态，看起来就是一个独立的方块
*/
.selector-box.is-collapsed .selector-item {
  border-top: none !important;
  border-right: none !important;
  border-bottom: none !important;
  border-left: none !important;
}

/* --- 通用 Item 样式 --- */
.selector-item {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  align-items: center;
  cursor: pointer; /* 增加手型 */
  /* 确保文字不换行，防止宽度挤压 */
  white-space: nowrap; 
  transition: background-color 0.2s, color 0.2s;
}

.selector-item.selected {
  background-color: var(--selector-selected-background-color);
  backdrop-filter: blur(10px) saturate(1.2);
  /* 注意：box-shadow 在 overflow: hidden 的容器内可能会被切掉一部分 */
  box-shadow: 0 0 10px var(--selector-selected-background-color);
}

/* --- 动画部分保持不变 --- */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 如果动画过程中出现布局跳动，
  通常对于 TransitionGroup 排序/移动，leave-active 需要 position: absolute。
  但因为这里是 flex 容器且有 overflow hidden，static 可能是为了保持容器体积。
  如果动画还有问题，可以尝试放开下面的注释。
*/
.list-leave-active {
  position: static; 
  /* position: absolute; */ 
}

.list-move {
  transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>