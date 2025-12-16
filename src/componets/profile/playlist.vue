<script setup>
    import SideNavBar from '../navigation/SideNavBar.vue';
    import {ref, onMounted} from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
</script>

<script>
  export default {
    name: 'PlaylistDashboard',
    data(){
      return{
        userPlaylists: [],
        loading: {
          playlists: true
        },
        showCreateModal: false,
        showAddToPlaylist: false,
        selectedSong: null,
        newPlaylist: {
          name: '',
          description: '',
          is_public: true
        },
        error: null
      }
    },
    async mounted(){
      await this.loadUserPlaylist();
    },
    methods: {
      async loadUserPlaylist(){
        try{
          this.loading.playlists = true;
          const response = await this.$plainAxios.get('/api/v1/playlists');
          this.userPlaylists = response.data;
        } catch(error){
          console.error('failed to load playlists: ', error);
          this.error = 'failed to load playlists';
        } finally {
          this.loading.playlists = false;
        }//end finally
      },

      async createPlaylist(){
        try{
          const response = await this.$plainAxios.post('/api/v1/playlist', {
            playlist: this.newPlaylist
          });
          this.userPlaylists.unshift(response.data);
          this.showCreateModal = false;
          this.resetNewPlaylist();
          this.error = null;

          //shows success message
          console.log('Playlist created successfully');
        } catch(error) {
            console.error('failed to create playlist: ',error);
            this.error = error.response?.data?.errors?.[0] || 'failed to create playlist';
        }//end catch
      },
      async addSongToPlaylist(playlistId, song){
        try{
          await this.$plainAxios.post(`/api/v1/playlists/${playlistId}/add_song`, {
            song_id: song.id
          });

          const playIndex = this.userPlaylists.findIndex(p => p.id === playlistId);

          if(playIndex !== -1){
            this.userPlaylists[playIndex].songs_count += 1;
          }//end if

          this.showAddToPlaylistModal = false;
          this.selectedSong = null;

          //success 
          console.log(`Added ${song.title} to playlist`);
        } catch(error){
          console.error('Failed to addd song to playlist:', error);
          this.error = error.response?.data?.error || 'failed to add song to playlist';
        }//end catch
      },

      async deletePlaylist(playlistId){
        if(!confirm('Are you sure you want to delete this playlist?')){
            return;
        }//end if

        try{
            await this.$plainAxios.delete(`/api/v1/playlists/${playlistId}`);

            //remove local from visit
            this.userPlaylists = this.userPlaylists.filter(p => p.id !== playlistId);
            console.log('Playlist deleted successfullty');
        } catch(error){
            console.error('failed to remove playlist', error);
            this.error = 'failed to remove playlist';
        }
      },//end delete playlist

      openAddToPlaylistModal(song){
        this.selectedSong = song;
        this.showAddToPlaylistModal = true;
        this.error = null;
      },

      resetNewPlaylist(){
        this.newPlaylist = {
          name: '',
          description: '',
          is_public: true
        };
      },

      navigateToPlaylist(playlistId){
        this.$router.push(`/playlists/${playlistId}`);
      }
    }
  }//end export
</script>

<template>
    <div class="flex h-screen bg-gray-900 text-white">
        <!-- Sidebar -->
        <SideNavBar>
            <h2 class="text-lg font-bold mb-4">Playlists</h2>
            <div class="space-y-2">
                <button 
                    @click="showCreateModal = true"
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                >
                    <span class="mr-2">+</span> Create New
                </button>
                <button 
                    @click="loadUserPlaylists"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                >
                    <span class="mr-2">↻</span> Refresh
                </button>
            </div>
        </SideNavBar>

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
                            @click="showCreateModal = true"
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                            to="/playlist"
                        >
                            Create Playlist
                        </button>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mb-4 p-4 bg-red-900/50 text-red-200 rounded-lg">
                    {{ error }}
                </div>

                <!-- Playlists Section -->
                <section class="mb-12">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl text-white">Your Playlists</h2>
                        <button
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                            @click="showCreateModal = true"
                        >
                            Create Playlist
                        </button>
                    </div>

                    <!-- Loading State -->
                    <div
                        v-if="loading.playlists"
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <div
                            v-for="n in 3"
                            :key="n"
                            class="animate-pulse bg-gray-700 rounded-lg p-6"
                        >
                            <div class="bg-gray-600 h-6 rounded mb-2"></div>
                            <div class="bg-gray-600 h-4 rounded w-3/4"></div>
                        </div>
                    </div>

                    <!-- Playlists Grid -->
                    <div
                        v-else-if="userPlaylists.length > 0"
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <div
                            v-for="playlist in userPlaylists"
                            :key="playlist.id"
                            class="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors"
                        >
                            <div 
                                class="p-6 cursor-pointer"
                                @click="navigateToPlaylist(playlist.id)"
                            >
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-white font-semibold text-xl truncate">
                                        {{ playlist.name }}
                                    </h3>
                                    <span 
                                        v-if="playlist.is_public"
                                        class="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                                    >
                                        Public
                                    </span>
                                    <span 
                                        v-else
                                        class="bg-gray-500 text-white text-xs px-2 py-1 rounded"
                                    >
                                        Private
                                    </span>
                                </div>
                                <p class="text-gray-400 mb-2">{{ playlist.songs_count || 0 }} songs</p>
                                <p class="text-gray-500 text-sm truncate">
                                    {{ playlist.description || "No description" }}
                                </p>
                                <div class="mt-4 text-xs text-gray-400">
                                    Created by {{ playlist.user?.username || 'You' }}
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="border-t border-gray-600 p-3 flex space-x-2">
                                <button
                                    @click="navigateToPlaylist(playlist.id)"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                                >
                                    View
                                </button>
                                <button
                                    @click.stop="deletePlaylist(playlist.id)"
                                    class="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-8 bg-gray-700 rounded-lg">
                        <p class="text-gray-400 text-lg mb-4">
                            You haven't created any playlists yet
                        </p>
                        <button
                            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
                            @click="showCreateModal = true"
                        >
                            Create Your First Playlist
                        </button>
                    </div>
                </section>
            </div>
        </div>

        <!-- Create Playlist Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 class="text-xl text-white mb-4">Create New Playlist</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-300 text-sm mb-2">Playlist Name</label>
                        <input
                            v-model="newPlaylist.name"
                            type="text"
                            placeholder="My Awesome Playlist"
                            class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    
                    <div>
                        <label class="block text-gray-300 text-sm mb-2">Description (Optional)</label>
                        <textarea
                            v-model="newPlaylist.description"
                            placeholder="A collection of my favorite songs..."
                            rows="3"
                            class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        ></textarea>
                    </div>
                    
                    <div class="flex items-center">
                        <input
                            v-model="newPlaylist.is_public"
                            type="checkbox"
                            id="is_public"
                            class="mr-2"
                        />
                        <label for="is_public" class="text-gray-300 text-sm">
                            Make playlist public
                        </label>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                    <button
                        @click="showCreateModal = false"
                        class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="createPlaylist"
                        :disabled="!newPlaylist.name.trim()"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Playlist
                    </button>
                </div>
            </div>
        </div>

        <!-- Add to Playlist Modal -->
        <div v-if="showAddToPlaylistModal && selectedSong" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 class="text-xl text-white mb-4">Add to Playlist</h3>
                <p class="text-gray-300 mb-4">Add "{{ selectedSong.title }}" by {{ selectedSong.artist }} to:</p>
                
                <div class="max-h-60 overflow-y-auto">
                    <div 
                        v-for="playlist in userPlaylists"
                        :key="playlist.id"
                        @click="addSongToPlaylist(playlist.id, selectedSong)"
                        class="p-3 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                    >
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-white font-medium">{{ playlist.name }}</h4>
                                <p class="text-gray-400 text-sm">{{ playlist.songs_count || 0 }} songs</p>
                            </div>
                            <span class="text-green-400">+ Add</span>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t border-gray-700">
                    <button
                        @click="showCreateModal = true; showAddToPlaylistModal = false;"
                        class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded transition-colors"
                    >
                        Create New Playlist
                    </button>
                </div>
                
                <div class="flex justify-end mt-4">
                    <button
                        @click="showAddToPlaylistModal = false"
                        class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>