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
            activeSection: 'artists' //default active section
        }
    },
    async mounted() {
        await this.loadDashboardData()
    },
    methods: {
    async loadDashboardData() {
        try{
            //loading featured artists
            const artistsResponse = await this.$plainAxios.get('/api/v1/music/featured_artists')
            this.featuredArtists = artistsResponse.data.artists
            this.loading.artists = false;

            //loading new release songs
            const releasesResponse = await this.$plainAxios.get('/api/v1/music/new_releases')
            this.newReleases = releasesResponse.data.songs
            this.loading.releases = false

            //load user playlists
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
    formatDuration(ms){
        if(!ms) return '0:00'
        const minutes = Math.floor(ms/60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },

    setActiveSection(section) {
        this.activeSection = section
    },

    addToPlaylist(song) {
        this.$emit('add-to-playlist', song)
        console.log(`Added "${song.title}" to playlist`)
    }
    }
}
</script>

<template>
    <div class="min-h-full bg-gray-800">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl text-white mb-2">Music Dashboard</h1>
      <p class="text-gray-400">Discover new artists, releases, and manage your playlists</p>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex space-x-4 mb-8 border-b border-gray-700">
      <button
        @click="setActiveSection('artists')"
        :class="`pb-2 px-1 border-b-2 transition-colors ${
          activeSection === 'artists' 
            ? 'border-blue-500 text-blue-400' 
            : 'border-transparent text-gray-400 hover:text-white'
        }`"
      >
        Featured Artists
      </button>
      <button
        @click="setActiveSection('releases')"
        :class="`pb-2 px-1 border-b-2 transition-colors ${
          activeSection === 'releases' 
            ? 'border-blue-500 text-blue-400' 
            : 'border-transparent text-gray-400 hover:text-white'
        }`"
      >
        New Releases
      </button>
      <button
        @click="setActiveSection('playlists')"
        :class="`pb-2 px-1 border-b-2 transition-colors ${
          activeSection === 'playlists' 
            ? 'border-blue-500 text-blue-400' 
            : 'border-transparent text-gray-400 hover:text-white'
        }`"
      >
        Your Playlists
      </button>
    </div>

    <!-- Featured Artists Section -->
    <section v-if="activeSection === 'artists'" class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl text-white">Featured Artists</h2>
        <button 
          @click="loadDashboardData"
          class="text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading.artists" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="bg-gray-700 rounded-full w-20 h-20 mx-auto mb-2"></div>
          <div class="bg-gray-700 h-4 rounded mb-1 w-16 mx-auto"></div>
          <div class="bg-gray-700 h-3 rounded w-12 mx-auto"></div>
        </div>
      </div>
      
      <!-- Artists Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
          <h3 class="text-white font-semibold text-sm mb-1 truncate">{{ artist.name }}</h3>
          <p class="text-gray-400 text-xs truncate">{{ artist.genre }}</p>
        </div>
      </div>
    </section>

    <!-- New Releases Section -->
    <section v-if="activeSection === 'releases'" class="mb-8">
      <h2 class="text-2xl text-white mb-6">New Releases</h2>
      
      <!-- Loading State -->
      <div v-if="loading.releases" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-gray-700 p-4 rounded-lg">
          <div class="bg-gray-600 h-40 rounded mb-4"></div>
          <div class="bg-gray-600 h-4 rounded mb-2"></div>
          <div class="bg-gray-600 h-3 rounded w-3/4 mb-1"></div>
          <div class="bg-gray-600 h-3 rounded w-1/2"></div>
        </div>
      </div>
      
      <!-- Releases grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <h3 class="text-white font-semibold text-lg mb-1 truncate">{{ song.title }}</h3>
              <p class="text-blue-300 text-sm mb-1 truncate">{{ song.artist }}</p>
              <p class="text-gray-400 text-xs mb-2 truncate">{{ song.album }}</p>
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-xs">{{ formatDuration(song.duration_ms) }}</span>
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

    <!-- Your Playlists Section -->
    <section v-if="activeSection === 'playlists'" class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl text-white">Your Playlists</h2>
        <button 
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
          @click="$router.push('/playlists/new')"
        >
          Create Playlist
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading.playlists" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="animate-pulse bg-gray-700 rounded-lg p-6">
          <div class="bg-gray-600 h-6 rounded mb-2"></div>
          <div class="bg-gray-600 h-4 rounded w-3/4"></div>
        </div>
      </div>
      
      <!-- Playlists Grid -->
      <div v-else-if="userPlaylists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in userPlaylists"
          :key="playlist.id"
          class="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
        >
          <h3 class="text-white font-semibold text-xl mb-2">{{ playlist.name }}</h3>
          <p class="text-gray-400">{{ playlist.songs_count || 0 }} songs</p>
          <p class="text-gray-500 text-sm mt-2 truncate">{{ playlist.description || 'No description' }}</p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8 bg-gray-700 rounded-lg">
        <p class="text-gray-400 text-lg mb-4">You haven't created any playlists yet</p>
        <button 
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
          @click="$router.push('/playlists/new')"
        >
          Create Your First Playlist
        </button>
      </div>
    </section>
  </div>
</template>