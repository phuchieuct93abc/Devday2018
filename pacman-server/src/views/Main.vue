<template>
  <div class="main">
    <main-board></main-board>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainBoard from '@/components/MainBoard.vue'

@Component({
  components: {
    MainBoard
  },
})
export default class Main extends Vue {}
</script>
