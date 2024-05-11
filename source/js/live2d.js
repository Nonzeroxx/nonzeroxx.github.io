// 动态导入 L2Dwidget.min.js
const scriptElement = document.createElement('script');
scriptElement.src = '/live2dw/lib/L2Dwidget.min.js';
document.head.appendChild(scriptElement);

// 在 L2Dwidget.min.js 加载完成后执行初始化
scriptElement.onload = () => {
  L2Dwidget.init({
    pluginRootPath: '/live2dw/', // 资源根路径
    pluginJsPath: 'lib/', // JS 文件相对路径
    pluginModelPath: 'assets/', // 模型文件相对路径
    tagMode: !1, // 标签模式
    debug: !1, // 调试模式
    model: {
      scale: 0.9, // 模型缩放比例
      jsonPath: '/live2dw/assets/asuna_04.model.json' // 模型 JSON 路径
    },
    display: {
      position: 'right', // 显示位置
      width: 240, // 宽度
      height: 460, // 高度
      hOffset: -60, // 水平偏移
      vOffset: -60 // 垂直偏移
    },
    mobile: {
      show: 1 // 是否在移动端显示
    },
    log: !1 // 是否显示日志
  });
};