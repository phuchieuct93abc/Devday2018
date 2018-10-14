<template>
  <div class="home">
    <play-board></play-board>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayBoard from '@/components/PlayBoard.vue'

@Component({
  components: {
    PlayBoard
  },
})
export default class Home extends Vue {}
</script>
