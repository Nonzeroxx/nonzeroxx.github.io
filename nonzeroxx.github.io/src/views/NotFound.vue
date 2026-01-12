<template>
  <div class="container">
    <div class="content">
      <h1>404</h1>
      <p>There is nothing here.</p>
      <a href="/">go back home</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  display: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
}
</style>
