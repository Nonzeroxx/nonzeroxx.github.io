import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { htmlClass } from "../utils/HtmlClass";
import { buildLog } from "../utils/Log";
import { useLocalStorage } from "./useLocalStorage";

const log = buildLog(true);
const THEME_STORAGE_KEY = "theme";
export const ThemeMode = {
  DARK: "dark",
  LIGHT: "light",
  AUTO: "auto",
};
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export function useTheme() {
  const themeModeStatus = useLocalStorage(THEME_STORAGE_KEY, ThemeMode.AUTO);

  const darkCls = htmlClass(ThemeMode.DARK);
  const lightCls = htmlClass(ThemeMode.LIGHT);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const getInitialTheme = (): ThemeMode => {
    // manual theme
    if (
      themeModeStatus.value === ThemeMode.DARK ||
      themeModeStatus.value === ThemeMode.LIGHT
    ) {
      return themeModeStatus.value;
    }
    // auto theme
    return mediaQuery.matches ? ThemeMode.DARK : ThemeMode.LIGHT;
  };
  // except for auto
  const currentTheme = ref<ThemeMode>(getInitialTheme());

  // get stored theme mode
  const currentThemeMode = computed(() => {
    return themeModeStatus.value;
  });

  // To change theme depending on whether prefers color scheme is dark
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (themeModeStatus.value === ThemeMode.AUTO) {
      log(e);
      e.matches
        ? (currentTheme.value = ThemeMode.DARK)
        : (currentTheme.value = ThemeMode.LIGHT);
    }
  };

  const applyDarkTheme = () => {
    lightCls.remove();
    darkCls.add();
  };

  const applyLightTheme = () => {
    darkCls.remove();
    lightCls.add();
  };

  const applyTheme = () => {
    if (currentTheme.value === ThemeMode.DARK) {
      applyDarkTheme();
    } else if (currentTheme.value === ThemeMode.LIGHT) {
      applyLightTheme();
    }
  };

  function toggleTheme(theme?: ThemeMode) {
    if (theme === undefined || theme === ThemeMode.AUTO) {
      themeModeStatus.value = ThemeMode.AUTO;
      mediaQuery.matches
        ? (currentTheme.value = ThemeMode.DARK)
        : (currentTheme.value = ThemeMode.LIGHT);
      return;
    }
    currentTheme.value = theme;
    themeModeStatus.value = theme;
  }

  watchEffect(() => {
    applyTheme();
  });
  onMounted(() => {
    applyTheme();
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  });

  onBeforeUnmount(() => {
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
  });
  return {currentThemeMode, toggleTheme};
}
