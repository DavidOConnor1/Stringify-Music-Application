<script>
    export default {
        name: "StringifyUserMusic",
        data() {
            return {
                songs: [],
                loading: true,
                error: null
            }
        },
        async created(){
            await this.fetchPublicUserSongs()
        },
        methods: {
            async fetchPublicUserSongs(){
                try{
                    this.loading = true
                    const response = await this.$plainAxios.get('/api/v1/public_songs')
                    this.songs = response.data
                } catch(error) {
                    console.error('Error Fetching Stringify Exculsive Artists Songs: ',error)
                    this.error = 'Failed to load songs'
                } finally {
                    this.loading = false
                }
            }
        }
    }
</script>

<template>
    <div class="min-h-screen bg-gray-800 py-10">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl text-white mb-8">Stringify Exclusive Songs</h1>
            <div v-if="songs.length === 0" class="text-white text-center">
                <p>No public songs available yet.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="song in songs" :key="song.id" class="bg-gray-700 p-4 rounded">
                    <h3 class="text-white text-xl">{{ song.title }}</h3>
                    <p class="text-gray-300">{{ song.year }}</p>
                    <!-- FIXED: Added ?. safe navigation -->
                    <p class="text-blue-300">{{ song.artist?.name || 'Unknown Artist' }}</p>
                    <p class="text-green-300 text-sm mt-2">By: {{ song.user?.username || 'Unknown User' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>