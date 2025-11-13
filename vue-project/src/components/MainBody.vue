<script setup>
 import BodySections from './BodySections.vue';
 import SideNavBar from './SideNavBar.vue';
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-white">
   
<SideNavBar />
    <!-- Main content area (takes up remaining space) -->
    <body-sections
     bg="bg-gray-800" class="flex-1  p-6 overflow-y-auto"
    >
    
      <h2 class="text-2xl font-bold mb-4">Big Section</h2>
    </body-sections>
  </div>
</template>
