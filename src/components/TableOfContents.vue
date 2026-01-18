<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

// 定义 TOC 数据结构
interface TocItem {
  id: string;
  text: string;
  level: number;
}

// 接收 props，允许自定义容器选择器
const props = defineProps({
  containerSelector: {
    type: String,
    default: "#article-content",
  },
});

const toc = ref<TocItem[]>([]);
const activeId = ref<string>("");
const isMobileMenuOpen = ref<boolean>(false);
const isMobile = ref<boolean>(window.innerWidth < 1200);
let observer: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

// 检测是否为移动端
const checkMobile = () => {
  const newIsMobile = window.innerWidth < 1200;

  if (isMobile.value !== newIsMobile) {
    closeMobileMenu(); // 关闭菜单并恢复滚动
    setTimeout(() => {
      isMobile.value = newIsMobile;
    }, 0);
  }
};

// 生成目录并添加 ID
const initToc = () => {
  const container = document.querySelector(props.containerSelector);
  if (!container) return;

  const headers = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const items: TocItem[] = [];

  headers.forEach((header, index) => {
    if (!header.id) {
      header.id = `heading-${index}`;
    }
    items.push({
      id: header.id,
      text: (header as HTMLElement).innerText,
      level: Number(header.tagName.replace("H", "")),
    });
  });

  toc.value = items;
  setupObserver(headers);
};

// 设置 IntersectionObserver 实现滚动高亮
const setupObserver = (headers: NodeListOf<Element>) => {
  const options = {
    root: null,
    rootMargin: "-100px 0px -66% 0px",
    threshold: 0,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id;
      }
    });
  }, options);

  headers.forEach((header) => observer?.observe(header));
};

// 点击目录平滑滚动
const scrollToHeader = (id: string) => {
  activeId.value = id;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    // 移动端点击后自动关闭菜单
    if (isMobile.value) {
      closeMobileMenu();
    }
  }
};

// 关闭移动端菜单并恢复滚动
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = "";
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
  } else {
    isMobileMenuOpen.value = true;
    document.body.style.overflow = "hidden";
  }
};

const menu = ref<HTMLElement | null>(null);
const menuSwitch = ref<HTMLElement | null>(null);

// 点击外部关闭菜单
const handleClick = (e: MouseEvent) => {
  if (!isMobileMenuOpen.value) return;
  if (menu.value === null || menuSwitch.value === null) return;

  if (
    !menu.value.contains(e.target as Node) &&
    !menuSwitch.value.contains(e.target as Node)
  ) {
    closeMobileMenu();
  }
};

onMounted(() => {
  initToc();

  // 监听窗口大小变化和点击事件
  window.addEventListener("resize", checkMobile);
  window.addEventListener("click", handleClick);

  // 使用 ResizeObserver 监听容器内容变化
  const container = document.querySelector(props.containerSelector);
  if (container) {
    resizeObserver = new ResizeObserver(() => {
      if (toc.value.length === 0) {
        initToc();
      }
    });
    resizeObserver.observe(container);
  }
});

onUnmounted(() => {
  // 清理：恢复滚动
  document.body.style.overflow = "";

  if (observer) {
    observer.disconnect();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("click", handleClick);
});
</script>

<template>
  <div v-if="toc.length > 0">
    <!-- 移动端悬浮按钮 -->
    <a
      v-if="isMobile"
      ref="menuSwitch"
      class="toc-mobile-trigger"
      @click="toggleMobileMenu"
      :class="{ active: isMobileMenuOpen }"
      aria-label="目录"
    >
      <Icon icon="solar:reorder-broken" width="28" height="28" />
    </a>

    <!-- 目录容器 -->
    <Transition :name="isMobile ? 'dropdown' : ''" mode="out-in">
      <nav
        ref="menu"
        v-if="isMobile ? isMobileMenuOpen : true"
        :key="isMobile ? 'mobile' : 'desktop'"
        class="toc-container"
        :class="{ 'mobile-menu': isMobile }"
      >
        <div class="toc-header">
          <h3>目录</h3>
        </div>

        <ul>
          <li
            v-for="item in toc"
            :key="item.id"
            :class="[
              'toc-item',
              `level-${item.level}`,
              { active: activeId === item.id },
            ]"
            @click="scrollToHeader(item.id)"
          >
            <a>{{ item.text }}</a>
          </li>
        </ul>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
/* 桌面端样式 */
.toc-container {
  position: sticky;
  top: 20px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1rem;
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toc-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  cursor: pointer;
  padding: 6px 0;
  font-size: 14px;
  transition: all 0.2s;
  line-height: 1.6;
  border-radius: 4px;
}

.toc-item.active {
  font-weight: 600;
  border-left: 2px solid #409eff;
}

/* 为 active 状态的不同层级设置正确的缩进 */
.toc-item.active.level-1 {
  padding-left: 8px;
}

.toc-item.active.level-2 {
  padding-left: 16px;
}

.toc-item.active.level-3 {
  padding-left: 28px;
}

.toc-item.active.level-4 {
  padding-left: 40px;
}

.toc-item.active.level-5 {
  padding-left: 52px;
}

.toc-item.active.level-6 {
  padding-left: 64px;
}

.toc-item a {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* 层级缩进 */
.level-1 {
  padding-left: 0;
}

.level-2 {
  padding-left: 8px;
}

.level-3 {
  padding-left: 20px;
  font-size: 13px;
}

.level-4 {
  padding-left: 32px;
  font-size: 13px;
}

.level-5 {
  padding-left: 44px;
  font-size: 12px;
}

.level-6 {
  padding-left: 56px;
  font-size: 12px;
}

/* 移动端悬浮按钮 */
.toc-mobile-trigger {
  position: fixed;
  width: 48px;
  height: 48px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  will-change: transform;
}

.toc-mobile-trigger:hover {
  transform: scale(1.3);
}

.toc-mobile-trigger:active {
  transform: scale(0.9);
}

/* 移动端目录样式 */
.toc-container.mobile-menu {
  position: fixed;
  top: 90px;
  right: 12px;
  width: fit-content;
  padding: 1rem;
  border: 1px solid var(--global-header-border-bottom-color);
  border-radius: 12px;
  box-shadow: 0 0 5px var(--popover-box-shadow-color);
  overflow-y: auto;
  background: var(--popover-background-color);
  backdrop-filter: blur(10px);
}

.mobile-menu .toc-item {
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 2px 0;
}

.mobile-menu .toc-item:active {
  border-radius: 4px;
}

/* 下拉动画效果 */
.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}

.dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
  transform-origin: top right;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.9);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.9);
}

/* 自定义滚动条 */
.toc-container::-webkit-scrollbar {
  width: 6px;
}

.toc-container::-webkit-scrollbar-track {
  border-radius: 3px;
}

.toc-container::-webkit-scrollbar-thumb {
  border-radius: 3px;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .toc-mobile-trigger {
    top: 50px;
    right: 8px;
    width: 44px;
    height: 44px;
  }
}

/* 标题的滚动偏移 */
:global(#article-content h1),
:global(#article-content h2),
:global(#article-content h3),
:global(#article-content h4),
:global(#article-content h5),
:global(#article-content h6) {
  scroll-margin-top: 65px;
}
</style>
