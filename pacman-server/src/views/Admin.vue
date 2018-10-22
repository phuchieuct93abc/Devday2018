<template>
    <div class="admin-page">
        <admin-panel></admin-panel>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import AdminPanel from "../components/AdminPanel.vue";

    @Component({
        components: {
            "admin-panel": AdminPanel
        }
    })
    export default class Admin extends Vue {


    }
</script>

<style lang="less" scoped>

</style>
