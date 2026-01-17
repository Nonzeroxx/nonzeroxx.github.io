<script setup lang="ts">
import { useDeviceClass } from "@/composable/useDeviceClass";
import { log } from "@/utils/Log";
import { ThemeMode, useTheme } from "@/composable/useTheme";
import { Icon } from "@iconify/vue";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import Popover from "@/components/Popover.vue";
import Selector from "@/components/Selector.vue";
import router from "@/router";

const isMobile = useDeviceClass();
const { currentThemeMode, toggleTheme } = useTheme();

const isSidebarCollapsed = ref(isMobile.value || false);

const asideMobileModeCls = computed(() => ({
  "mobile-mode": isMobile.value,
  collapsed: isSidebarCollapsed.value && isMobile.value,
  expand: !isSidebarCollapsed.value && isMobile.value,
}));

const asideDesktopModeCls = computed(() => ({
  "desktop-mode": !isMobile.value,
  collapsed: isSidebarCollapsed.value && !isMobile.value,
  expand: !isSidebarCollapsed.value && !isMobile.value,
}));

const toggleSidebarIcon = computed(() => {
  return isSidebarCollapsed.value
    ? "solar:login-2-broken"
    : "solar:logout-2-broken";
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleThemeIcon = computed(() => {
  if (currentThemeMode.value === ThemeMode.AUTO) {
    return "solar:stars-broken";
  } else if (currentThemeMode.value === ThemeMode.DARK) {
    return "solar:moon-fog-broken";
  } else {
    return "solar:sun-fog-broken";
  }
});
interface Item {
  icon?: string;
  label: string;
  value: string;
}
const toggleThemeMode = (item: Item) => {
  log("toggle theme: ", item);
  toggleTheme(item.value);
};

const themes: Array<Item> = [
  {
    icon: "solar:stars-broken",
    label: "Auto",
    value: "auto",
  },
  {
    icon: "solar:moon-fog-broken",
    label: "Dark",
    value: "dark",
  },
  {
    icon: "solar:sun-fog-broken",
    label: "Light",
    value: "light",
  },
];

watchEffect(() => {
  log("collapsed: ", isSidebarCollapsed.value);
});

const asideContentRef = ref<HTMLElement | null>(null);
const mainContentRef = ref<HTMLElement | null>(null);
const clickOutside = (e: MouseEvent) => {
  if (isSidebarCollapsed.value || !isMobile.value) return;
  if (!asideContentRef.value || !mainContentRef.value) return;
  if (
    !asideContentRef.value.contains(e.target as Node) &&
    mainContentRef.value.contains(e.target as Node)
  ) {
    toggleSidebar();
  }
};

const goto = (path: string) => {
  router.push(path);
  if(isMobile.value && !isSidebarCollapsed.value) {
    toggleSidebar()
  }
}

onMounted(() => {
  window.addEventListener("click", clickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", clickOutside);
});
</script>

<template>
  <header class="globalheader">
    <nav class="globalnav">
      <section class="globalnav-left">
        <span @click="$router.push('/')" class="globalnav-title">Hiki Niito's space</span>
      </section>
      <section class="globalnav-right">
        <Popover v-if="!isMobile" placement="bottom" trigger="hover">
          <template #reference>
            <Icon :icon="toggleThemeIcon" class="global-icon" />
          </template>
          <p style="margin: 8px 0 16px 0; font-weight: bold">Apperance</p>
          <Selector
            v-model="currentThemeMode"
            @select="toggleThemeMode"
            :items="themes"
          />
        </Popover>
        <Icon
          @click="toggleSidebar"
          :icon="toggleSidebarIcon"
          class="global-icon"
        />
      </section>
    </nav>
  </header>
  <main class="main">
    <aside class="aside" :class="asideDesktopModeCls">
      <section
        ref="asideContentRef"
        class="aside-content"
        :class="asideMobileModeCls"
      >
        <ol>
          <li @click="goto('/404')">Connectivity Test</li>
          <li @click="goto('/konosuba')">konosuba</li>
        </ol>
        <div v-if="isMobile" class="aside-theme-switch">
          <Selector
            placement="column"
            v-model="currentThemeMode"
            @select="toggleThemeMode"
            :items="themes"
          />
        </div>
      </section>
    </aside>
    <section
      ref="mainContentRef"
      class="main-content"
      :class="{ blurred: isMobile && !isSidebarCollapsed }"
    >
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <KeepAlive><component :is="Component" /></KeepAlive>
        </transition>
      </router-view>
    </section>
  </main>
</template>

<style scoped>
/* header */
.globalheader {
  position: fixed;
  width: 100vw;
  height: var(--global-header-height);
  box-sizing: border-box;
  background-color: var(--global-header-background-color);
  backdrop-filter: saturate(1.2) blur(10px);
  border-bottom: 1px solid var(--global-header-border-bottom-color);
  z-index: var(--zindex-globalheader);

  /* nav */
  .globalnav {
    padding: 0 20px;
    height: 100%;
    margin: auto;
    max-width: calc(var(--global-page-width) + 200px);
    box-sizing: border-box;

    display: flex;
    justify-content: space-between;
    align-items: center;

    /* title */
    .globalnav-title {
      font-size: var(--title-font-size);
      font-weight: var(--title-font-weight);
    }
  }

  .globalnav-right {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
  }
}
/* header end */

/* main */
.main {
  display: flex;
  padding-top: var(--global-header-height);
  max-width: var(--global-page-width);
  height: 100vh;
  margin: auto;
  z-index: var(--zindex-main);

  /* aside */
  .aside {
    flex: 1;
    max-width: 280px;
    overflow: hidden;
    /* background-color: rgb(56, 160, 160); */
    transition: max-width 0.4s ease-in-out;

    ul,
    ol {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .aside-content {
      padding: 30px 25px;
      box-sizing: border-box;
      height: calc(100% - var(--global-header-height));
      will-change: transform, opacity, visibity;
      z-index: var(--zindex-aside-content);

      li {
        padding-top: 20px;
      }

      .aside-theme-switch {
        position: fixed;
        left: 0px;
        bottom: 0px;
      }
    }
  }

  /* content */
  .main-content {
    flex: 1;
    /* background-color: rgb(85, 171, 85); */
    padding: 20px 20px;
    transition: filter 0.4s ease-in-out;

    p {
      white-space: pre-wrap;
    }

    &.blurred {
       /* it causes containing block context issue */
      /* filter: blur(2px) brightness(0.95); */
    }
  }
}

/* main end */

/* page width change small */
@media (max-width: 1000px) {
  .main {
    .expand {
      &.aside {
        max-width: 255px;
      }
    }
  }
}

@media (max-width: 720px) {
  .main {
    .aside {
      max-width: 0;

      .aside-content {
        opacity: 0;
      }
    }
  }
}
/* end width small */

/* page width change large */
@media (min-width: 720px) {
  .main {
    .expand {
      &.aside {
        max-width: 255px;
      }
    }
  }
}

@media (min-width: 1000px) {
  .main {
    .expand {
      &.aside {
        max-width: 280px;
      }
    }
  }
}
/* end width large */
</style>
