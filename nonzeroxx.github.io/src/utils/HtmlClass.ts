/**
 * 
 * @param className the class name need to opeate to html
 * @returns the operation of class name
 */
export function htmlClass(className: string) {
    const html = document.documentElement;
    const add = () => {
        html.classList.add(className);
    }
    const remove = () => {
        html.classList.remove(className);
    }
    const toggle = (force?: boolean) => {
        if(force === undefined) {
            html.classList.toggle(className);
        }else if(force) {
            add();
        }else {
            remove();
        }
    }

    return {
        add,
        remove,
        toggle
    }
}