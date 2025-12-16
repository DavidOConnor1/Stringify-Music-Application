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
    <!-- Sidebar -->
    <SideNavBar>
      <h2 class="text-lg font-bold mb-4">Small Section</h2>
      <div class="text-gray-400">
        <p>Explore featured content below</p>
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
    <div class="flex h-screen bg-gray-900 text-white">
      <!-- Playlists Section -->
        <section class="mb-12">
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
              class="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <h3 class="text-white font-semibold text-xl mb-2">
                {{ playlist.name }}
              </h3>
              <p class="text-gray-400">{{ playlist.songs_count || 0 }} songs</p>
              <p class="text-gray-500 text-sm mt-2 truncate">
                {{ playlist.description || "No description" }}
              </p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8 bg-gray-700 rounded-lg">
            <p class="text-gray-400 text-lg mb-4">
              You haven't created any playlists yet
            </p>
            <button
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
              @click="$router.push('/playlists/new')"
            >
              Create Your First Playlist
            </button>
          </div>
        </section>
        </div>
        </div>
        </div>
      </div>
    </div>
</template>