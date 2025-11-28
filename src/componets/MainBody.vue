<script setup>
import BodySections from "./BodySections.vue";
import SideNavBar from "./SideNavBar.vue";
import Features from "./Features.vue";
import stringifyUserMusic from "./stringifyUserMusic.vue";

</script>

<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <SideNavBar>
      
      <h2 class="text-lg font-bold mb-4">Small Section</h2>
    <div class="flex flex-col space-y-4">
    


      <!--Create a Playlist-->
      <Features>
         Create a Playlist
         </Features>

      <!--Finding new Genres-->
      <Features> 
        <router-link to="/musicDashboard">
           Find Your Genre
        </router-link>
       </Features>
      </div>
      </SideNavBar>
    
    <body-sections bg="bg-gray-800" class="flex-1 p-6 overflow-y-auto">
      <div class="space-y-8">
     <stringifyUserMusic />
    
      </div>
    </body-sections>
  </div>
</template>
