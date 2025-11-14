<script>
export default {
  name: "Artists",
  data() {
    return {
      artists: [],
      newArtist: {
        name: ""
      },
      error: "",
      editedArtist: null, 
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
    } else {
      this.$securedAxios 
        .get("/api/v1/artists")
        .then((response) => {
          this.artists = response.data;
        })
        .catch((error) =>
          this.setError(
            error,
            "There was an error trying to connect the server"
          )
        );
    }
  },
  methods: {
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
    },
    addArtist() {
      const value = this.newArtist.name;
      if (!value) {
        this.error = "Please enter an artist name";
        return;
      }
      this.$securedAxios 
        .post("/api/v1/artists", { artist: { name: this.newArtist.name } }) 
        .then((response) => {
          this.artists.push(response.data);
          this.newArtist.name = ""; 
          this.error = ""; // Clear error on success
        })
        .catch((error) => this.setError(error, "Cannot create artist"));
    },
    removeArtist(artist) {
      if (confirm(`Are you sure you want to delete "${artist.name}"?`)) {
        this.$securedAxios
          .delete(`/api/v1/artists/${artist.id}`)
          .then((response) => {
            this.artists = this.artists.filter(a => a.id !== artist.id); 
          })
          .catch((error) =>
            this.setError(error, "Cannot remove artist at this time")
          );
      }
    },
    editArtist(artist) { 
      this.editedArtist = artist;
    },
    updateArtist(artist) { 
      this.$securedAxios 
        .patch(`/api/v1/artists/${artist.id}`, {
          artist: { name: artist.name }, 
        })
        .then(() => {
          this.editedArtist = null; // Close edit form
          this.error = ""; // Clear error on success
        })
        .catch((error) => this.setError(error, "Cannot update artist"));
    },
    cancelEdit() {
      this.editedArtist = null;
      this.error = "";
    }
  },
};
</script>

<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red-500 mb-4" v-if="error">{{ error }}</div>
    <h3 class="font-mono font-regular text-3xl mb-4">Add Your Artist</h3>
    <form @submit.prevent="addArtist">
      <div class="mb-6">
        <input
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2"
          autofocus
          autocomplete="off"
          placeholder="Enter Your Favourite Artist"
          v-model="newArtist.name"
        />
      </div>

      <button
        type="submit"
        class="font-bold px-4 rounded cursor-pointer no-underline bg-gradient-to-b from-[#0072FF] to-[#00C853] block py-4 text-white items-center justify-center w-full"
      >
        Add Artist
      </button>
    </form>
    <hr class="border border-gray-300 my-6" />
    <ul class="list-reset mt-4">
      <li
        class="py-4 border-b border-gray-200"
        v-for="artist in artists"
        :key="artist.id"
      >
        <div class="flex items-center justify-between flex-wrap">
          <p class="block flex-1 font-mono font-semibold items-center text-lg">
            {{ artist.name }}
          </p>

          <div class="flex space-x-2">
            <button
              class="bg-transparent text-sm hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500 no-underline font-bold py-2 px-4 rounded"
              @click.prevent="editArtist(artist)"
            >
              Edit
            </button>

            <button
              class="bg-transparent text-sm hover:bg-red-500 hover:text-white text-red-500 border border-red-500 no-underline font-bold py-2 px-4 rounded"
              @click.prevent="removeArtist(artist)"
            >
              Delete
            </button>
          </div>
        </div>
        <div v-if="artist === editedArtist" class="mt-4 p-4 bg-gray-50 rounded border border-gray-300">
          <form @submit.prevent="updateArtist(artist)">
            <div class="flex items-center space-x-2">
              <input 
                type="text" 
                class="flex-1 border border-gray-300 rounded px-3 py-2"
                v-model="artist.name" 
              />
              <button
                type="submit"
                class="bg-green-500 text-white text-sm hover:bg-green-600 no-underline font-bold py-2 px-4 rounded"
              >
                Update
              </button>
              <button
                type="button"
                @click="cancelEdit"
                class="bg-gray-500 text-white text-sm hover:bg-gray-600 no-underline font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>