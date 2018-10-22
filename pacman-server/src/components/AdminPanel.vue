<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
            </v-flex>

            <v-flex mb-4>
                <h1 class="display-2 font-weight-bold mb-3">
                    Welcome to Admin page
                </h1>
                <p class="subheading font-weight-regular">
                    For help and collaboration with other Vuetify developers,
                    <br>please join our online
                </p>
            </v-flex>

            <v-flex mb-5 xs12>
                <h2 class="headline font-weight-bold mb-3">Player 1</h2>

                <v-layout justify-center>
                    <a v-for
                               ="(next, i) in whatsNext" :key="i" :href="next.href" class="subheading mx-3"
                       target="_blank">{{
                        next.text }}</a>
                </v-layout>
            </v-flex>

            <v-flex xs12 mb-5>
                <h2 class="headline font-weight-bold mb-3">Player 2</h2>

                <v-layout justify-center>
                    <a v-for="(link, i) in importantLinks" :key="i" :href="link.href" class="subheading mx-3"
                       target="_blank">{{ link.text }}</a>
                </v-layout>
            </v-flex>

            <v-flex xs12 mb-5>
                <h2 class="headline font-weight-bold mb-3">Test Player</h2>

                <v-layout justify-center>
                    <a v-for="(eco, i) in ecosystem" :key="i" :href="eco.href" class="subheading mx-3" target="_blank">{{
                        eco.text }}</a>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            ecosystem: [
                {
                    text: 'vuetify-loader',
                    href: 'https://github.com/vuetifyjs/vuetify-loader'
                }
            ],
            importantLinks: [
                {
                    text: 'Documentation',
                    href: 'https://vuetifyjs.com'
                }
            ],
            whatsNext: [
                {
                    text: 'Explore components',
                    href: 'https://vuetifyjs.com/components/api-explorer'
                }

            ]
        })
    }
</script>

<style>

</style>
