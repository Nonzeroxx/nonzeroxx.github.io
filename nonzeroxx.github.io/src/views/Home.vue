<script setup lang="ts">
import { useDeviceClass } from "@/composable/useDeviceClass";
import { log } from "@/utils/Log";
import { ThemeMode, useTheme } from "@/composable/useTheme";
import { Icon } from "@iconify/vue";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import Popover from "@/components/Popover.vue";
import Selector from "@/components/Selector.vue";

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
  if (isSidebarCollapsed.value) return;
  if (!isMobile.value) return;
  if (!asideContentRef.value || !mainContentRef.value) return;
  if (
    !asideContentRef.value.contains(e.target as Node) &&
    mainContentRef.value.contains(e.target as Node)
  ) {
    toggleSidebar();
  }
};

const poem = `君不见黄河之水天上来，奔流到海不复回。
君不见高堂明镜悲白发，朝如青丝暮成雪。
人生得意须尽欢，莫使金樽空对月。
天生我材必有用，千金散尽还复来。
烹羊宰牛且为乐，会须一饮三百杯。
岑夫子，丹丘生，将进酒，杯莫停。
与君歌一曲，请君为我倾耳听。
钟鼓馔玉不足贵，但愿长醉不愿醒。
古来圣贤皆寂寞，惟有饮者留其名。
陈王昔时宴平乐，斗酒十千恣欢谑。
主人何为言少钱，径须沽取对君酌。
五花马、千金裘，呼儿将出换美酒，与尔同销万古愁。`;

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
        <span class="globalnav-title">Hiki Niito's space</span>
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
          Connectivity Test
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
      <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
        {{ poem }}
      </p>
      <Transition>
        <RouterView />
      </Transition>
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

    .aside-content {
      padding: 30px 25px;
      box-sizing: border-box;
      height: calc(100% - var(--global-header-height));
      will-change: transform, opacity, visibity;
      z-index: var(--zindex-aside-content);

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
      filter: blur(2px) brightness(0.95);
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
