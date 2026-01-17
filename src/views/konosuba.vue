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
  <main class="article-container">
    <article id="article-content">
      <h1>阿克西斯教团</h1>
      <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
        受水之女神阿库娅领导的阿克西斯教团祝来到本教团圣城阿尔坎雷堤亚的您能顺利加入阿克西斯教团，越活越年轻，越活越快乐，越活越无脑。请大声呼喊水之女神阿库娅赐予的神之咒语：<span style="font-weight: bold;">“厄里斯的胸部是垫出来的！”</span>
      </p>
      <h2>教义</h2>
      <ul>
        <li>
          阿克西斯教徒努力就能做到，即便失败不是信徒的错，不能成功都是世界的错。从不开心的事情中逃避即可，逃避不是失败。
        </li>
        <li>
          犹豫过久得出的答案，无论如何选择都会后悔，反正都要后悔，就选择当下的快乐吧。别太担忧晚年如何，未来的你是否笑着，连神明都不知道，那就乐在当下吧。
        </li>
        <li>
          不想努力是世间的错，本性恶劣是环境的错，长得丑是遗传基因的错。不要责备自己，将责任推卸给他人便好。
        </li>
        <li>
          博爱主义，只要恋爱对象并非不死族或恶魔，只要有爱且不犯法，全都可以得到赦免。
        </li>
        <li><span style="font-weight: bold;">“厄里斯的胸部是垫出来的！”</span></li>
        <li>
          阿克西斯教教义第七项：汝，勿要忍耐。想喝的时候就喝，想吃的时候就吃便好。因为明天并不见得还能吃得到。
        </li>
        <li>反正都要失败不如放手去做，失败之后跑路就好了</li>
      </ul>
      <h2>入教加持</h2>
      <ul>
        <li>变得多才多艺</li>
        <li>吸引不死怪物</li>
        <li>吓跑包括强盗和魔王军在内的正常人</li>
        <li>即便在机动要塞毁灭者经过的地方也能和杂草一起顽强地生存下来。</li>
        <li>与基友喜结良缘</li>
      </ul>
      <h2>教团戒律</h2>
      <p style="white-space: pre-wrap; margin: 0; line-height: 1.5">
        触怒女神可能会遭到的天罚：在上厕所时，外面有人等，马桶却冲不出水。 
      </p>
      <h2>入教申请书</h2>
      <img src="@/assets/images/阿克西斯教团入教申请书.jpg" alt="阿克西斯教团入教申请书">
      <h2>引用来源</h2>
      <a href="https://moegirl.icu/%E9%98%BF%E5%85%8B%E8%A5%BF%E6%96%AF%E6%95%99%E5%9B%A2#">萌娘百科---阿克西斯教团</a>
      <section style="margin: 40px; text-align: center;">--- End ---</section>
    </article>
    <TableOfContents class="article-toc" />
  </main>
</template>

<style scoped>
li {
  margin: 10px 0 0 30px;
  list-style: disc;
}
.article-container {
  display: flex;
  gap: 20px;
  width: 100%;

  #article-content {
    flex: 4;
  }

  .article-toc {
    flex: 1;
  }
}
</style>
