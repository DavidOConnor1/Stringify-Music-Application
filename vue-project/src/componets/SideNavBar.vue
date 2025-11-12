<script setup>
    import Features from '@/componets/Features.vue';
    import BodySections from '@/componets/BodySections.vue';
</script>

<template>
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
</template>