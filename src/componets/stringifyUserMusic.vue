<script>
export default {
    name: "StringifyUserMusic",
    data() {
        return {
            exclusiveSongs: [],
            featuredArtists: [],
            loading: {
                songs: true,
                artists: true
            },
            error: null
        }
    },
    async created(){
        await this.fetchPublicUserSongs();
        await this.fetchFeaturedArtists();
    },
    methods: {
        async fetchPublicUserSongs(){
            try{
                this.loading.songs = true;
                const response = await this.$plainAxios.get('/api/v1/public_songs');
                console.log('API Response:', response.data);
                // Make sure we're getting an array
                this.exclusiveSongs = response.data || [];
            } catch(error) {
                console.error('Error Fetching Stringify Exclusive Artists Songs: ', error);
                this.error = 'Failed to load songs';
                this.exclusiveSongs = []; // Ensure it's always an array
            } finally {
                this.loading.songs = false;
            }
        },

        async fetchFeaturedArtists() {
            try {
                this.loading.artists = true;
                // Try to fetch featured artists, but if endpoint doesn't exist, use fallback
                const response = await this.$plainAxios.get('/api/v1/music/featured_artists');
                
                // Properly handle the response
                if (response.data && Array.isArray(response.data.artists)) {
                    this.featuredArtists = response.data.artists;
                } else if (Array.isArray(response.data)) {
                    this.featuredArtists = response.data;
                } else {
                    // If no artists endpoint, use fallback data or empty array
                    this.featuredArtists = this.getFallbackArtists();
                }
            } catch(error) {
                console.error('Error fetching featured artists:', error);
                // Use fallback artists instead of crashing
                this.featuredArtists = this.getFallbackArtists();
            } finally {
                this.loading.artists = false;
            }
        },

        getFallbackArtists() {
            // Return some fallback artist data if the API endpoint doesn't exist yet
            return [
                {
                    id: 1,
                    name: "Billie Eilish",
                    genre: "Alternative",
                    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/300x300bb.jpg"
                },
                {
                    id: 2,
                    name: "Kendrick Lamar",
                    genre: "Hip-Hop",
                    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9e/57/22/9e5722a9-0c83-58e1-4b3f-7f3d6d0b22a3/196589486069.jpg/300x300bb.jpg"
                },
                {
                    id: 3,
                    name: "Taylor Swift",
                    genre: "Pop",
                    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9c/91/83/9c918303-e0a4-30d0-6e51-9993a635b4e7/196589486069.jpg/300x300bb.jpg"
                },
                {
                    id: 4,
                    name: "The Weeknd",
                    genre: "R&B",
                    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/b2/47/6b/b2476b5c-7620-602f-933e-6d8e3557e274/22UMGIM15338.rgb.jpg/300x300bb.jpg"
                }
            ];
        },

        addToPlaylist(song) {
            this.$emit('add-to-playlist', song);
            // You can add a toast notification here
            console.log(`Added "${song.title}" to playlist`);
        }
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-800 py-8">
        <div class="max-w-7xl mx-auto px-4">
            
            <!-- Stringify Exclusive Songs Section -->
            <section class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl text-white font-bold">Stringify Exclusive</h1>
                    <button 
                        @click="fetchPublicUserSongs"
                        class="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                        Refresh
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="loading.songs" class="flex space-x-6 overflow-x-auto py-4">
                    <div v-for="n in 4" :key="n" class="flex-shrink-0 w-64 animate-pulse">
                        <div class="bg-gray-700 rounded-lg p-4">
                            <div class="bg-gray-600 h-5 rounded mb-2"></div>
                            <div class="bg-gray-600 h-4 rounded w-3/4 mb-1"></div>
                            <div class="bg-gray-600 h-3 rounded w-1/2"></div>
                            <div class="bg-gray-600 h-8 rounded mt-3"></div>
                        </div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-8 bg-red-900/20 rounded-lg">
                    <p class="text-red-400 text-lg">Failed to load songs</p>
                    <p class="text-red-300 text-sm mt-2">Please check your connection and try again</p>
                </div>

                <!-- No Songs State -->
                <div v-else-if="!exclusiveSongs || exclusiveSongs.length === 0" class="text-center py-12 bg-gray-700 rounded-lg">
                    <p class="text-gray-400 text-lg">No exclusive songs available yet.</p>
                    <p class="text-gray-500 text-sm mt-2">Be the first to share your music!</p>
                </div>

                <!-- Songs Row -->
                <div v-else class="flex space-x-6 overflow-x-auto pb-4">
                    <div 
                        v-for="song in exclusiveSongs" 
                        :key="song.id" 
                        class="flex-shrink-0 w-64 bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                    >
                        <!-- Song Info Only (No Artwork) -->
                        <h3 class="text-white font-semibold text-lg mb-2 truncate">{{ song.title || 'Untitled Song' }}</h3>
                        <p class="text-gray-300 text-sm mb-1">{{ song.year || 'Unknown Year' }}</p>
                        <p class="text-blue-300 text-sm mb-2 truncate">{{ song.artist?.name || 'Unknown Artist' }}</p>
                        <p class="text-green-300 text-xs mb-3 truncate">By: {{ song.user?.username || 'Unknown User' }}</p>

                        <!-- Playlist Button -->
                        <button
                            @click="addToPlaylist(song)"
                            class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors"
                        >
                            Add to Playlist
                        </button>
                    </div>
                </div>
            </section>

            <!-- Featured Artists Section -->
            <section class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl text-white font-bold">Featured Artists</h2>
                    <button 
                        @click="fetchFeaturedArtists"
                        class="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                        Refresh
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="loading.artists" class="flex space-x-6 overflow-x-auto py-4">
                    <div v-for="n in 6" :key="n" class="flex-shrink-0 w-32 animate-pulse">
                        <div class="text-center">
                            <div class="bg-gray-700 rounded-full w-24 h-24 mx-auto mb-2"></div>
                            <div class="bg-gray-700 h-4 rounded mb-1 w-20 mx-auto"></div>
                            <div class="bg-gray-700 h-3 rounded w-16 mx-auto"></div>
                        </div>
                    </div>
                </div>

                <!-- Artists Row -->
                <div v-else class="flex space-x-8 overflow-x-auto pb-4">
                    <div 
                        v-for="artist in featuredArtists" 
                        :key="artist.id"
                        class="flex-shrink-0 text-center cursor-pointer group"
                    >
                        <div class="relative mb-3">
                            <img 
                                :src="artist.artwork" 
                                :alt="artist.name"
                                class="w-24 h-24 rounded-full object-cover mx-auto border-2 border-transparent group-hover:border-blue-500 transition-colors"
                                @error="handleImageError"
                            />
                            <div class="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                        <h3 class="text-white font-semibold text-sm mb-1 truncate w-28 mx-auto">{{ artist.name }}</h3>
                        <p class="text-gray-400 text-xs truncate w-28 mx-auto">{{ artist.genre }}</p>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar styling */
.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #6B7280;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
}
</style>