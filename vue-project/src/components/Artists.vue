<script>
import { Update } from "vite";

export default {
  name: "Artists",
  data() {
    return {
      artists: [],
      newArtist: [],
      error: "",
      editArtist: "",
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
    } else {
      this.$http.secured
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
      const value = this.newArtist;
      if (!value) {
        return;
      }
      this.$http.secured
        .post("/api/v1/artists", { artists: { name: this.newArtist.name } })
        .then((response) => {
          this.artists.push(response.data);
          this.newArtist = "";
        })
        .catch((error) => this.setError(error, "cannot create artist"));
    },
    removeArtist(artist) {
      this.$http.secured
        .delete(`/api/v1/artists/${artist.id}`)
        .then((response) => {
          this.artists.splice(this.artists.indexOf(artist), 1);
        })
        .catch((error) =>
          this.setError(error, "Cannot remove Artist at this time")
        );
    },
    editArtist(artist) {
      this.editedArtist = artist;
    },
    updatedArtist(artist) {
      this.editedArtist = "";
      this.$http.secured
        .patch(`/api/v1/artists/${artist.id}`, {
          artist: { title: artist.name },
        })
        .catch((error) => this.setError(error, "cannot update artist"));
    },
  },
};
</script>

<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>
    <h3 class="font-mono font-regular text-3xl mb-4">Add Your Artist</h3>
    <form @submit.prevent="addArtist">
      <div class="mb-6">
        <input
          type="text"
          class=""
          autofocus
          autocomplete="off"
          placeholder="Enter Your Favourite Artist"
          v-model="newArtist.name"
        />
      </div>

      <input
        type="submit"
        value="Add Artist"
        class="font-bold px-4 rounded cursor-pointer no-underline bg-gradient-to-b from-[#0072FF] to-[#00C853] block py-4 text-white items-center justify-center"
      />
    </form>
    <hr class="border border-grey-light my-6" />
    <ul class="list-reset mt-4">
      <li
        class="py-4"
        v-for="artist in artists.slice(0, artists.length)"
        :key="artist.id"
        :artist="artist"
      >
        <div class="flex items-center justify-between flex-wrap">
          <p class="block flex-1 font-mono font-semibold items-center">
            {{ artist.name }}
          </p>

          <button
            class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue-300 border border-blue-200 no-underline font-bold py-2 px-4 mr-2 rounded"
            @click.prevent="editArtist(artist)"
          >
            Edit
          </button>

          <button
            class="bg-transparent text-sm hover:bg-red hover:text-white text-red-300 border border-red-200 no-underline font-bold py-2 px-4 mr-2 rounded"
            @click.prevent="removeArtist(artist)"
          >
            Delete
          </button>
        </div>
        <div v-if="artist == editedArtist">
          <form @submit.prevent="updatedArtist(artist)">
            <div class="mb-6 p-4 bg-white rounded border border-gray-200">
              <input type="text" class="" v-model="artist.name" />
              <input
                type="submit"
                value="Update"
                class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue-300 border border-blue-200 no-underline font-bold py-2 px-4 mr-2 rounded cursor-pointer"
              />
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>
