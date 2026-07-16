<template>
  <main>
    <MainImage />
    <BoardList />
    <MapPreview />
    <Graph />
  </main>
</template>

<script setup>
// 메인 페이지 전용 컴포넌트들만 import
import MainImage from '../components/main/mainImage.vue';
import BoardList from '../components/main/boardList.vue'; 
import MapPreview from '../components/main/mapPreview.vue';
import Graph from '../components/main/graph.vue';
</script>