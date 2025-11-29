<script>
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