<script setup lang="ts">
import { onMounted, ref } from 'vue';


  const wtf = ref<HTMLElement | null>(null);

function typeWriter(element: HTMLElement | null, text: string, delay = 100) {
  if(element === null) return;
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, delay);
}

onMounted(() => {
  typeWriter(wtf.value, "「私は……プログラミング、楽しいって思ったこと一度もない。」");
})
</script>

<template>
  <div class="welcome-container">
    <h1 ref="wtf"></h1>
  </div>
</template>

<style scoped>
  .welcome-container {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;

    li:hover {
      color: aqua;
      scale: 1.3;
    }
  }
</style>
