<script setup lang="ts">
import { log } from "@/utils/Log";
import { debounce } from "@/utils/debounce";
import { computed, nextTick, onMounted, onUnmounted, ref, Teleport } from "vue";

const referenceRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

type placement = "top" | "bottom" | "left" | "right";
type trigger = "hover" | "click" | "manual";

const props = withDefaults(
  defineProps<{
    placement?: placement;
    trigger?: trigger;
    offset?: number;
    gap?: number;
    modelValue?: boolean;
  }>(),
  {
    placement: "bottom",
    trigger: "click",
    offset: 16,
    gap: 16,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const innerVisible = ref(false);

const visible = computed({
  get() {
    return props.trigger === "manual" ? !!props.modelValue : innerVisible.value;
  },
  set(v: boolean) {
    props.trigger === "manual"
      ? emit("update:modelValue", v)
      : (innerVisible.value = v);
  },
});

const open = () => {
  visible.value = true;
  nextTick(caculatePosition);
};

const close = () => {
  visible.value = false;
};

const toggle = () => {
  visible.value ? close() : open();
};

let openTimer: number | null = null;
let closeTimer: number | null = null;

const clearTimers = () => {
  if (openTimer) clearTimeout(openTimer);
  if (closeTimer) clearTimeout(closeTimer);
  openTimer = closeTimer = null;
};

const referenceEvents = computed(() => {
  if (props.trigger === "hover") {
    return {
      onMouseenter() {
        clearTimers();
        openTimer = window.setTimeout(open, 100);
      },
      onMouseleave() {
        clearTimers();
        closeTimer = window.setTimeout(close, 100);
      },
    };
  }

  if (props.trigger === "click") {
    return {
      onClick(e: MouseEvent) {
        e.stopPropagation();
        toggle();
      },
    };
  }
});

const popoverEvents = computed(() => {
  return {
    onMouseenter() {
      if (props.trigger === "click") return;
      clearTimers();
    },
    onMouseleave() {
      if (props.trigger === "click") return;
      clearTimers();
      closeTimer = window.setTimeout(close, 100);
    },
  };
});

const clickOutside = (e: MouseEvent) => {
  if (props.trigger === "click") {
    if (!popoverRef.value?.contains(e.target as Node)) close();
  }
};

const popoverLeft = ref(0);
const popoverTop = ref(0);

const popoverPosition = computed(() => ({
  top: `${popoverTop.value}px`,
  left: `${popoverLeft.value}px`,
}));

const caculatePosition = () => {
  if (!referenceRef.value || !popoverRef.value) {
    log("referenceRef: ", referenceRef.value);
    log("popoverRef: ", popoverRef.value);
    return;
  }

  const ref = referenceRef.value.getBoundingClientRect();
  const pop = popoverRef.value.getBoundingClientRect();

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = 0;
  let top = 0;

  const checkLeft = (left: number): number => {
    if (ref.left >= vw / 2) {
      if (left + pop.width >= vw) {
        return vw - pop.width - props.gap;
      }
    } else {
      if (left <= 0) {
        return props.gap;
      }
    }
    return left;
  };

  const checkTop = (top: number): number => {
    if (ref.height <= vh / 2) {
      if (top <= 0) {
        return props.gap;
      }
    } else {
      if (top + pop.height >= vh) {
        return vh - pop.height - props.gap;
      }
    }
    return top;
  };

  switch (props.placement) {
    case "top": {
      left = ref.left - (pop.width - ref.width) / 2;
      left = checkLeft(left);
      top = ref.top - pop.height - props.offset;
      break;
    }
    case "bottom": {
      left = ref.left - (pop.width - ref.width) / 2;
      left = checkLeft(left);
      top = ref.bottom + props.offset;
      break;
    }
    case "left": {
      top = ref.top - (pop.height - ref.height) / 2;
      top = checkTop(top);
      left = ref.left - pop.width - props.offset;
      break;
    }
    case "right": {
      top = ref.top - (pop.height - ref.height) / 2;
      top = checkTop(top);
      left = ref.left + ref.width + props.offset;
      break;
    }
  }
  popoverTop.value = top;
  popoverLeft.value = left;
};

const animationOffset = computed(() => {
  const offset = 8;

  switch (props.placement) {
    case "top":
      return { x: 0, y: offset };
    case "bottom":
      return { x: 0, y: -offset };
    case "left":
      return { x: offset, y: 0 };
    case "right":
      return { x: -offset, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
});

const debounceCaculatePosition = debounce(caculatePosition, 10);

onMounted(() => {
  window.addEventListener("click", clickOutside);
  window.addEventListener("resize", debounceCaculatePosition);
});

onUnmounted(() => {
  window.removeEventListener("click", clickOutside);
  window.removeEventListener("resize", debounceCaculatePosition);
});
</script>

<template>
  <span ref="referenceRef" class="popover-reference" v-bind="referenceEvents">
    <slot name="reference" />
  </span>
  <Teleport to="body">
    <Transition name="popover">
      <div
        v-if="visible"
        ref="popoverRef"
        :style="{
          '--enter-x': `${animationOffset.x}px`,
          '--enter-y': `${animationOffset.y}px`,
          ...popoverPosition,
        }"
        class="popover-content"
        v-bind="popoverEvents"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popover-reference {
  display: inline-block;
}
.popover-content {
  position: fixed;
  padding: 8px 12px;
  box-sizing: border-box;
  box-shadow: 0 0 5px var(--popover-box-shadow-color);
  backdrop-filter: blur(20px) saturate(1.2);
  background-color: var(--popover-background-color);
  border: 1px solid var(--global-header-border-bottom-color);
  border-radius: 16px;
  z-index: var(--zindex-popover);
}

.popover-enter-active,
.popover-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translate(var(--enter-x), var(--enter-y)) scale(0.98);
}

.popover-enter-to,
.popover-leave-from {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}

</style>
