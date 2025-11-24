<script setup>
import Features from "@/componets/Features.vue";
import BodySections from "@/componets/BodySections.vue";
</script>

<template>
  <!-- Sidebar (small fixed width like Spotify nav) -->
  <body-sections
    bg="bg-gradient-to-b from-[#0072FF] to-[#00C853]"
    class="w-60 p-4 flex flex-col"
  >
    <h2 class="text-lg font-bold mb-4">Options</h2>
    <div class="flex flex-col space-y-4">
      <!--Create a Playlist-->
      <Features> 
    <router-link 
    to="/profile">
        Settings 
    </router-link>    
    </Features>

      <!--Finding new Genres-->
      <Features>
        <router-link 
        to="/beartist">
         Become an Artist
         </router-link>
         </Features>
    </div>
  </body-sections>
</template>
