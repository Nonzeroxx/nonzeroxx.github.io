import { ref, watchEffect, type Ref } from "vue";
import { htmlClass } from "../utils/HtmlClass";
import { useWindowWidth } from "./useWidth";
import { buildLog} from "../utils/Log";

const log = buildLog(false);

/** 
 * auto toggle mobile or desktop class to html dependence on window's width
 * @returns isMobile reference
 */
export function useDeviceClass():Ref<boolean, boolean> {
  const isMobile = ref(false);
  const mobileMode = htmlClass("mobile");
  const desktopMode = htmlClass("desktop");

  const windowWidth = useWindowWidth();

  watchEffect(() => {
    if (windowWidth.value < 720) {
      isMobile.value = true;
      mobileMode.add();
      desktopMode.remove();
    } else {
      isMobile.value = false;
      mobileMode.remove();
      desktopMode.add();
    }
    log("window width: ", windowWidth.value);
    log("device: ",isMobile.value? "Mobile": "Desktop");
  });

  return isMobile;
}
