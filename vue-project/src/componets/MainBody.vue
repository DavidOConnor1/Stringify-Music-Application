<script setup>
import BodySections from '@/componets/BodySections.vue';
import Features from '@/componets/Features.vue';
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <!-- Sidebar (small fixed width like Spotify nav) -->
    <body-sections
      bg="bg-gradient-to-b from-[#0072FF] to-[#00C853]" class="w-60  p-4 flex flex-col"
    >
      <h2 class="text-lg font-bold mb-4">Small Section</h2>
      <div class="flex flex-col space-y-4">
        <!--Create a Playlist-->
      <Features>
        Create a Playlist
      </Features>

      <!--Finding new Genres-->
      <Features>
        Find Your Genre
      </Features>
    </div>
    </body-sections>

    <!-- Main content area (takes up remaining space) -->
    <body-sections
     bg="bg-gray-800" class="flex-1  p-6 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Big Section</h2>
    </body-sections>
  </div>
</template>
