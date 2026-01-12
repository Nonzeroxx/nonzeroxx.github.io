export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

/**
  * T extends (...args: any[]) => any  |  泛型约束：T 必须是一个函数
  * Parameters<T>	                   |   自动提取原函数的参数类型
  * ThisParameterType<T>	           |   保留原函数的 this 上下文（避免箭头函数丢失 this）
  * ReturnType<typeof setTimeout>	   |   兼容浏览器和 Node.js 的 setTimeout 返回类型（比 number 更安全）
  */