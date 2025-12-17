<script>
export default {
  name: 'MusicSearch',
  data() {
    return {
      searchQuery: '',
      songs: [],
      loading: false,
      searchTimeout: null
    }
  },
  methods: {
    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.searchSongs()
      }, 500) // Wait 500ms after user stops typing
    },
    async searchSongs() {
      if (this.searchQuery.length < 2) {
        this.songs = []
        return
      }

      this.loading = true
      try {
        const response = await this.$plainAxios.get('/api/v1/music/search', {
          params: { 
            query: this.searchQuery,
            limit: 20
          }
        })
        this.songs = response.data.results
      } catch (error) {
        console.error('Music search failed:', error)
        this.songs = []
      } finally {
        this.loading = false
      }
    },
    addToPlaylist(song) {
      // You can integrate this with your existing playlist system
      this.$emit('add-to-playlist', song)
      alert(`Added "${song.title}" by ${song.artist} to playlist!`)
    },
    formatDuration(ms) {
      if (!ms) return '0:00'
      const minutes = Math.floor(ms / 60000)
      const seconds = Math.floor((ms % 60000) / 1000)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-800 py-10">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-white mb-8 text-center">Discover Music</h1>
      
      <!-- Search Bar -->
      <div class="mb-8">
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          placeholder="Search for songs, artists, or albums..."
          class="w-full p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-white">
        <p>Searching for music...</p>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && !loading && songs.length === 0" class="text-center text-white">
        <p>No songs found for "{{ searchQuery }}"</p>
      </div>

      <!-- Search Results -->
      <div v-else-if="songs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="song in songs"
          :key="song.id"
          class="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors"
        >
          <!-- Album Art -->
          <div class="relative">
            <img
              :src="song.album_image || song.artwork || '/placeholder-album.jpg'"
              :alt="song.album"
              class="w-full h-48 object-cover"
            />
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded px-2 py-1">
              <span class="text-white text-sm">{{ formatDuration(song.duration_ms || song.duration) }}</span>
            </div>
          </div>

          <!-- Song Info -->
          <div class="p-4">
            <h3 class="text-white font-semibold text-lg mb-1 truncate">{{ song.title }}</h3>
            <p class="text-blue-300 mb-1 truncate">{{ song.artist }}</p>
            <p class="text-gray-400 text-sm mb-3 truncate">{{ song.album }}</p>
            
            <!-- Audio Preview -->
            <audio
              v-if="song.preview_url"
              controls
              class="w-full mb-3"
            >
              <source :src="song.preview_url" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
            <p v-else class="text-gray-500 text-sm mb-3">No preview available</p>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              
              <a
                v-if="song.external_url"
                :href="song.external_url"
                target="_blank"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
              >
                View
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center text-gray-400">
        <p>Search for your favorite songs to get started!</p>
      </div>
    </div>
  </div>
</template>
