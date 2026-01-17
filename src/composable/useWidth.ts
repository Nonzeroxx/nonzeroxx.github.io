import { debounce } from "@/utils/debounce";
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * 
 * @param eleRef target element's reference
 * @returns element's width
 */
export function useElementWidth(eleRef: { value: Element; }) {
    const width = ref(0);
    let observer: ResizeObserver | null = null;

    onMounted(() => {
        if(!eleRef.value) return;
        observer = new ResizeObserver(entries => {
            width.value = entries[0]?.contentRect.width ?? 0;
        });
        observer.observe(eleRef.value);
    })

    onBeforeUnmount(() => {
        observer?.disconnect()
    })
    return width;
}

/**
 * 
 * @param delay after delay ms to fetch window's width
 * @returns window's width
 */
export function useWindowWidth(delay: number = 10) {
    const windowWidth = ref(window.innerWidth);
    const handleResize = debounce(() => {
        windowWidth.value = window.innerWidth;
    }, delay)

    onMounted(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
    });

    return windowWidth;
}