<script>
export default{
    name: 'MusicDashboard',
    data(){
        return{
            featuredArtists: [],
            newReleases: [],
            userPlaylists: [],
            loading: {
                artists: true,
                releases: true,
                playlists: true
            },
            randomTerms: [
                'pop', 'rock', 'hip hop', 'electronic', 'jazz', 'r&b', 
                'indie', 'alternative', 'rap', 'lofi', 'edm', 'folk',
                'country', 'metal', 'punk', 'soul', 'funk', 'reggae',
                'classical', 'blues', 'house', 'techno', 'dance', 'kpop'
            ]
        }
    },
    async mounted() {
        await this.loadDashboardData()
    },
    methods: {
    async loadDashboardData() {
        try{
            // Get random artists from iTunes API
            const randomArtistTerm = this.randomTerms[Math.floor(Math.random() * this.randomTerms.length)]
            const artistsResponse = await this.$plainAxios.get('/api/v1/music/search', {
                params: {
                    query: randomArtistTerm,
                    limit: 12
                }
            })
            
            // Extract unique artists from search results
            this.featuredArtists = this.extractUniqueArtists(artistsResponse.data.results || [])
            this.loading.artists = false;

            // Get random songs from iTunes API (different genre)
            let randomSongTerm
            do {
                randomSongTerm = this.randomTerms[Math.floor(Math.random() * this.randomTerms.length)]
            } while (randomSongTerm === randomArtistTerm) // Ensure different genre for variety
            
            const releasesResponse = await this.$plainAxios.get('/api/v1/music/search', {
                params: {
                    query: randomSongTerm,
                    limit: 8
                }
            })
            this.newReleases = releasesResponse.data.results || []
            this.loading.releases = false

            // User playlists
            const playlistsResponse = await this.$plainAxios.get('/api/v1/playlists')
            this.userPlaylists = playlistsResponse.data
            this.loading.playlists = false

        } catch (error) {
            console.error('Failed to load dashboard: ', error)
            this.loading.artists = false
            this.loading.releases = false
            this.loading.playlists = false
        }
    },
    
    // Extract unique artists from search results
    extractUniqueArtists(songs) {
        const artistMap = new Map()
        
        songs.forEach(song => {
            if (song.artist && !artistMap.has(song.artist)) {
                artistMap.set(song.artist, {
                    id: song.id, // Use song ID as temporary artist ID
                    name: song.artist,
                    genre: song.genre || 'Various',
                    artwork: song.album_image
                })
            }
        })
        
        return Array.from(artistMap.values()).slice(0, 6) // Return max 6 unique artists
    },
    
    // Refresh both artists and songs with new random content
    async refreshWithNewRandom() {
        this.loading.artists = true
        this.loading.releases = true
        
        try {
            // Get new random artists
            const randomArtistTerm = this.randomTerms[Math.floor(Math.random() * this.randomTerms.length)]
            const artistsResponse = await this.$plainAxios.get('/api/v1/music/search', {
                params: {
                    query: randomArtistTerm,
                    limit: 12
                }
            })
            this.featuredArtists = this.extractUniqueArtists(artistsResponse.data.results || [])
            
            // Get new random songs (different genre)
            let randomSongTerm
            do {
                randomSongTerm = this.randomTerms[Math.floor(Math.random() * this.randomTerms.length)]
            } while (randomSongTerm === randomArtistTerm)
            
            const releasesResponse = await this.$plainAxios.get('/api/v1/music/search', {
                params: {
                    query: randomSongTerm,
                    limit: 8
                }
            })
            this.newReleases = releasesResponse.data.results || []
            
        } catch (error) {
            console.error('Failed to refresh with new random content: ', error)
        } finally {
            this.loading.artists = false
            this.loading.releases = false
        }
    },
    
    formatDuration(ms){
        if(!ms) return '0:00'
        const minutes = Math.floor(ms/60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    
    addToPlaylist(song) {
        this.$emit('add-to-playlist', song)
        console.log(`Added "${song.title}" to playlist`)
    }
    }
}
</script>

<script setup>
import SideNavBar from "../navigation/SideNavBar.vue";
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Sidebar -->
    <SideNavBar>
      <h2 class="text-lg font-bold mb-4">Music Dashboard</h2>
      <div class="text-gray-400">
        <p>Explore featured content below</p>
      </div>
    </SideNavBar>

    <!-- Main Content Area -->
    <div class="flex-1 p-6 overflow-y-auto bg-gray-800">
      <div class="min-h-full">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl text-white mb-2">Find Your Genre</h1>
              <p class="text-gray-400">
                Discover new artists, releases, and manage your playlists
              </p>
            </div>
            <button
              @click="refreshWithNewRandom"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🎲</span>
              <span>Shuffle Content</span>
            </button>
          </div>
        </div>

        <!-- Featured Artists Section -->
        <section class="mb-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl text-white">Featured Artists</h2>
            
          </div>

          <!-- Loading State -->
          <div
            v-if="loading.artists"
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            <div v-for="n in 6" :key="n" class="animate-pulse">
              <div
                class="bg-gray-700 rounded-full w-20 h-20 mx-auto mb-2"
              ></div>
              <div class="bg-gray-700 h-4 rounded mb-1 w-16 mx-auto"></div>
              <div class="bg-gray-700 h-3 rounded w-12 mx-auto"></div>
            </div>
          </div>

          <!-- Artists Grid -->
          <div
            v-else
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            <div
              v-for="artist in featuredArtists"
              :key="artist.id"
              class="text-center cursor-pointer group"
            >
              <div class="relative mb-3">
                <img
                  :src="artist.artwork"
                  :alt="artist.name"
                  class="w-20 h-20 rounded-full object-cover mx-auto border-2 border-transparent group-hover:border-blue-500 transition-colors"
                />
              </div>
              <h3 class="text-white font-semibold text-sm mb-1 truncate">
                {{ artist.name }}
              </h3>
              <p class="text-gray-400 text-xs truncate">{{ artist.genre }}</p>
            </div>
          </div>
        </section>

        <!-- New Releases Section -->
        <section class="mb-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl text-white">New Releases</h2>
            
          </div>

          <!-- Loading State -->
          <div
            v-if="loading.releases"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="n in 6"
              :key="n"
              class="animate-pulse bg-gray-700 p-4 rounded-lg"
            >
              <div class="bg-gray-600 h-40 rounded mb-4"></div>
              <div class="bg-gray-600 h-4 rounded mb-2"></div>
              <div class="bg-gray-600 h-3 rounded w-3/4 mb-1"></div>
              <div class="bg-gray-600 h-3 rounded w-1/2"></div>
            </div>
          </div>

          <!-- Releases Grid -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="song in newReleases"
              :key="song.id"
              class="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div class="flex space-x-4">
                <img
                  :src="song.album_image"
                  :alt="song.album"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-semibold text-lg mb-1 truncate">
                    {{ song.title }}
                  </h3>
                  <p class="text-blue-300 text-sm mb-1 truncate">
                    {{ song.artist }}
                  </p>
                  <p class="text-gray-400 text-xs mb-2 truncate">
                    {{ song.album }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-xs">{{
                      formatDuration(song.duration_ms)
                    }}</span>
                    <button
                      @click="addToPlaylist(song)"
                      class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      
      </div>
    </div>
  </div>
</template>
