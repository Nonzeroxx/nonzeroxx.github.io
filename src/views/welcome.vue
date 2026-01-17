<script setup lang="ts">
import TableOfContents from "@/components/TableOfContents.vue";

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
</script>

<template>
  <article id="article-content">
    <h1>h1</h1>
    <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
    <h2>h2</h2>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>    <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
    <h2>h2-another</h2>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
    <h3>h3</h3>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
    <h4>h4</h4>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
    <h5>h5</h5>
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
      {{ poem }}
    </p>
    <h6>h6</h6>
    <TableOfContents />
  </article>
</template>

<style scoped></style>
