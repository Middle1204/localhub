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
import MainImage from '../components/main/MainImage.vue';
import BoardList from '../components/main/BoardList.vue'; 
import MapPreview from '../components/main/MapPreview.vue';
import Graph from '../components/main/Graph.vue';
</script>