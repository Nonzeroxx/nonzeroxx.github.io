<script setup lang="ts">
import { buildLog } from "@/utils/Log";
import { Icon } from "@iconify/vue";
import { onMounted, ref, onBeforeUnmount, computed } from "vue";

const log = buildLog(false);

interface Item {
  icon?: string;
  label: string;
  value: string;
}

const props = defineProps<{
  items: Item[];
  modelValue?: string | null;
  placement?: 'top' | 'bottom' | 'left' | 'right'; // 用于控制展开模式和方向
}>();

const emit = defineEmits<{
  (e: "select", v: Item): void;
}>();

const selectItem = (item: Item) => {
  log("select item");
  emit("select", item);
  if (props.placement) {
    isVisible.value = false; // 选择后收起
  }
};

// 是否选中
const isSelected = (item: Item) => {
  return props?.modelValue === item.value;
};

// 获取当前选中项，如果未选中则取第一个
const selectedItem = () => {
  return props.items.find(item => isSelected(item)) || props.items[0] || { label: '未选择', value: '' };
};

// 展开状态
const isVisible = ref(false);
const selectorRef = ref<HTMLElement | null>(null);

// 是否显示项
const showItem = (item: Item) => {
  if (!props.placement) return true;
  if (isVisible.value) return true;
  return isSelected(item);
};

// 处理点击：未展开时点击选中项展开，展开时点击任意项选择并收起
const handleClick = (item: Item) => {
  if (props.placement && !isVisible.value && isSelected(item)) {
    isVisible.value = true; // 展开
  } else {
    selectItem(item); // 选择并收起
  }
};

// 是否竖向展开
const isVertical = () => {
  return props.placement === 'top' || props.placement === 'bottom';
};

// 计算 max-height 或 max-width 用于动画（假设每项 40px，包括 padding）
const itemSize = 40; // 可调整，根据实际项高度/宽度
const computedMaxSize = computed(() => {
  if (!props.placement) return 'auto';
  const size = isVisible.value ? props.items.length * itemSize : itemSize;
  return `${size}px`;
});

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (props.placement && isVisible.value) {
    if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
      isVisible.value = false;
    }
  }
};

onMounted(() => {
  log("selector props: ", props);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="selectorRef" class="selector-wrapper">
    <ul
      class="selector-box"
      :class="{ expanded: isVisible && props.placement, [props.placement || '']: isVisible && props.placement, vertical: isVisible && isVertical() }"
      :style="{ [isVertical() ? 'maxHeight' : 'maxWidth']: computedMaxSize }"
    >
      <li
        v-for="item in items"
        v-show="showItem(item)"
        :key="item.value"
        @click="handleClick(item)"
        class="selector-item"
        :class="{ selected: isSelected(item), 'no-selected': props.placement && !isVisible && isSelected(item) }"
      >
        <Icon v-if="item.icon" :icon="item.icon" class="global-icon" />
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.selector-wrapper {
  position: relative;
  display: inline-block;
}

.selector-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border-radius: 8px;
  border: 1px solid var(--global-header-border-bottom-color);
  overflow: hidden;
  transition: max-height 0.3s ease, max-width 0.3s ease; /* 添加动画过渡 */
}

.selector-item {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  align-items: center;
  cursor: pointer;
}

.selector-box:not(.expanded):not(.vertical) .selector-item:not(:last-child) {
  border-right: 1px solid var(--global-header-border-bottom-color);
}

.selector-box.expanded.vertical .selector-item:not(:last-child) {
  border-bottom: 1px solid var(--global-header-border-bottom-color);
}

.selector-box.expanded:not(.vertical) .selector-item:not(:last-child) {
  border-right: 1px solid var(--global-header-border-bottom-color);
}

.selector-item.selected {
  background-color: var(--selector-selected-background-color);
  backdrop-filter: blur(10px) saturate(1.2);
  box-shadow: 0 0 10px var(--selector-selected-background-color);
}

/* 未展开时不显示选中效果 */
.selector-item.no-selected {
  background-color: transparent;
  backdrop-filter: none;
  box-shadow: none;
}

/* 展开时的方向调整 */
.selector-box.expanded {
  /* 默认向下展开 */
}

.selector-box.expanded.bottom {
  flex-direction: column;
}

.selector-box.expanded.top {
  flex-direction: column-reverse;
}

.selector-box.expanded.left {
  flex-direction: row-reverse;
}

.selector-box.expanded.right {
  flex-direction: row;
}
</style>