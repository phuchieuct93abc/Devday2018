<template>
  <div class="home">
    <testing-board></testing-board>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TestingBoard from '@/components/TestingBoard.vue'

@Component({
  components: {
    TestingBoard
  },
})
export default class Home extends Vue {}
</script>
