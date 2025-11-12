<script>
</script>

<template>        
    <div class="max-w-md m-auto py-10">
        <div class="text-red" v-if="error">{{ error }}</div>
        <h3 class="font-mono font-regular text-3xl mb-4">Add Your Artist</h3>
        <form @submit.prevent="addArtist">
            <div class="mb-6">
                <input type="text" class=""
                autofocus
                autocomplete="off"
                placeholder="Enter Your Favourite Artist"
                v-model="newArtist.name">
            </div>

            <input type="submit" value="Add Artist" class="font-bold px-4 rounded cursor-pointer no-underline bg-gradient-to-b from-[#0072FF] to-[#00C853] 
            block py-4 text-white items-center justify-center"/>
        </form>
        <hr class="border border-grey-light my-6">
        <ul class="list-reset mt-4">
            <li class="py-4" v-for="artist in artists.slice(0, artists.length)"
                    :key="artist.id"
                    :artist="artist">
                
            </li>
        </ul>
    </div>
</template>