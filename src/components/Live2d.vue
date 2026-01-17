<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as PIXI from "pixi.js";
import { InternalModel, Live2DModel } from "pixi-live2d-display/cubism4"; // 只用 Cubism4
import { buildLog } from "@/utils/Log";

const log = buildLog(true);

// 1. 暴露 PIXI 给 window (必须，用于 Cubism SDK)
(window as any).PIXI = PIXI;

// 2. 显式注册 Ticker，确保动画流畅
Live2DModel.registerTicker(PIXI.Ticker);

const canvas = ref<HTMLCanvasElement | null>(null);
let app: PIXI.Application | null = null;
let model: Live2DModel<InternalModel> | null = null;

onMounted(async () => {
  if (!canvas.value) return;

  // 初始化 Pixi 应用
  app = new PIXI.Application({
    view: canvas.value,
    autoStart: true,
    backgroundAlpha: 0, // 透明背景
  });

  try {
    model = await Live2DModel.from(
      "/live2d/アクア ［花鳥風月］/［花鳥風月］アクア.model3.json",
      // "/live2d/アクア ［きらめく海の世界］/［きらめく海の世界］アクア.model3.json"
      // "/live2d/めぐみん ［ナイス爆裂!!］/［ナイス爆裂!!］めぐみん.model3.json"
      // "/live2d/Og Aqua Slime/Character.model3.json"
      // "/live2d/ウィズ ［うっかりバニーガール］/［うっかりバニーガール］ウィズ.model3.json"
      // "/live2d/ウィズ ［今夜はクリスマス］/［今夜はクリスマス］ウィズ.model3.json"
      // "/live2d/4 star xmas yunyun/Character.model3.json"
    );

    if (!model) return;
    app.stage.addChild(model);

    // --- 4. 修正模型位置与缩放 ---
    // 居中逻辑：先重置锚点到中心
    model.anchor.set(0.5, 0.5);

    // 设置位置为屏幕中心
    model.x = app.renderer.width / 1.51;
    model.y = app.renderer.height / 1.19; // 或者 / 1.5 让它稍微靠下

    // 等比缩放 (保持宽高比，不要写 (0.4, 0.2) 这种不一样的数值)
    // 根据窗口大小动态调整缩放是个好习惯，这里先给一个固定值测试
    model.scale.set(0.48, 0.24);

    // --- 5. 开启交互 ---
    model.cursor = "pointer"; // 鼠标放上去变小手

    // --- 6. 动作播放逻辑优化 ---
    const motions = [1, 9, 14, 5]; // 12, 17 x
    let motionPointer = 0;

    const plusOneMotionPointer = () => {
      return motionPointer = (motionPointer + 1) % motions.length;
    };

    let motionTimeout: ReturnType<typeof setTimeout> | null = null;
    model.on("pointertap", () => {
      // 强制停止当前所有正在播放的动作
      // model?.internalModel.motionManager.stopAllMotions();

      if (motionTimeout !== null) clearTimeout(motionTimeout);

      // 尝试触发动作。注意：如果没有名为 "TapBody" 的组，可以尝试传 null 或检查模型定义
      // 很多模型的通用点击动作组是 "TapBody"
      // 如果你想强制播放某个 index，无论组名是什么，该库目前的 API 可能需要特定组名
      // 如果传 "" 能跑通则保留，否则建议先打印 model.internalModel.motionManager.definitions 看看
      model?.motion("", motions[motionPointer]);
      log(`Playing motion index: ${motions[motionPointer]}`);
      motionTimeout = setTimeout(() => {
        plusOneMotionPointer();
      }, 3000);
    });
    model?.motion("", motions[0]);
    setInterval(() => {
      model?.motion("", motions[plusOneMotionPointer()]);
    }, 15000);
  } catch (error) {
    console.error("Failed to load Live2D:", error);
  }
});

onBeforeUnmount(() => {
  // 销毁时清理资源
  if (app) {
    app.destroy(true, { children: true, texture: true, baseTexture: true });
    app = null;
  }
});
</script>

<template>
  <canvas id="live2d" class="live2d-canvas" ref="canvas"></canvas>
</template>

<style scoped>
.live2d-canvas {
  position: fixed;
  width: 220px;
  height: 350px;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
