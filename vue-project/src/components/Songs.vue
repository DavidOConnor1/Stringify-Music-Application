<script>
export default {
  name: "Songs",
  data() {
    return {
      artists: [],
      songs: [],
      newSong: [],
      error: "",
      editedSong: "",
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
    } else {
      //connecting to the songs controller
      this.$http.secured
        .get("/api/v1/songs")
        .then((response) => {
          this.songs = response.data;
        })
        .catch((error) =>
          this.setError(
            error,
            "An Error has occured when trying to connect to the backend"
          )
        );

      //connecting to the artists controller
      this.$http.secured
        .get("/api/v1/artists")
        .then((response) => {
          this.artists = response.data;
        })
        .catch((error) =>
          this.setError(
            error,
            "An Error has occured when trying to connect to the backend"
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
    getArtist(song) {
      const songArtistValues = this.artists.filter(
        (artist) => artist.id === song.artist_id
      );

      //loops through the artists
      let artist;
      songArtistValues.forEach(function (element) {
        artist = element.name;
      });
      return artist;
    },
    addSong() {
      const value = this.newSong;
      if (!value) {
        return;
      } else {
        this.$http.secured
          .post("/api/v1/songs", {
            song: {
              title: this.newSong.title,
              year: this.newSong.year,
              artist_id: this.newSong.artist,
            },
          })
          .then((response) => {
            this.songs.push(response.data);
            this.newSong = "";
          })
          .catch((error) =>
            this.setError(error, "Unable to create a new Song")
          );
      }
    },
    removeSong(song) {
      this.$http.secured
        .delete(`/api/v1/songs/${song.id}`)
        .then((response) => {
          this.songs.splice(this.songs.indexOf(song), 1);
        })
        .catch((error) =>
          this.setError(error, "Unable to delete the song at this time")
        );
    },
    editSong(song) {
      this.editedSong = song;
    },
    updateSong(song) {
      this.editSong = "";
      this.$http.secured
        .patch(`/api/v1/songs/${song.id}`, {
          song: { title: song.title, year: song.year, artist_id: song.artist },
        })
        .catch((error) =>
          this.setError(error, "Unable to update song at this time")
        );
    },
  },
};
</script>

<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">
      {{ error }}
    </div>
    <h3 class="font-mono font-regular text-3xl mb-4">Add a New Song</h3>
    <form @submit.prevent="addSong">
      <div class="mb-6">
        <label for="song_title">Title:</label>
        <input
          type="text"
          id="song_title"
          autofocus
          autocomplete="false"
          placeholder="Type a song name"
          v-model="newSong.title"
        />
      </div>
      <div class="mb-6">
        <label for="song_year">Year:</label>
        <input
          type="text"
          id="song_year"
          autofocus
          autocomplete="false"
          placeholder="Year"
          v-model="newSong.year"
        />
      </div>

      <div class="mb-6">
        <label for="artist">Artist:</label>
        <select id="artist" v-model="newSong.artist">
          <option disabled value="">Select an Artist</option>
          <option :value="artist.id" v-for="artist in artists" :key="artist.id">
            {{ artist.name }}
          </option>
        </select>
        <p class="pt-4">
          Is your Favourite Artist not there?
          <router-link to="/artists" class="text-grey:100"
            >Add Your Artist</router-link
          >
        </p>
      </div>
      <input
        type="submit"
        value="addSong"
        class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue-300 border-blue-200 no-underline font-bold py-2 px-4 mr-2 rounded cursor-pointer"
      />

      <hr class="border border-grey-light my-6" />

      <ul class="list-reset mt-4">
        <li class="py-4" v-for="song in songs" :key="song.id" :song="song">
          <div class="flex items-center justify-between flex-wrap">
            <div class="flex-1 justify-between flex-wrap pr-4">
              <p class="block font-mono font-semibold items-center">
                {{ song.title }} &mdash; {{ song.year }}
              </p>
              <p class="block font-mono font-semibold">{{ getArtist(song) }}</p>
            </div>
            <button
              class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue-300 border border-blue-200 no-underline font-bold py-2 px-4 mr-2 rounded"
              @click.prevent="editSong(song)"
            >
              Edit
            </button>

            <button
              class="bg-transparent text-sm hover:bg-red hover:text-white text-red-300 border border-red-200 no-underline font-bold py-2 px-4 mr-2 rounded"
              @click.prevent="removeSong(song)"
            >
              Delete
            </button>
          </div>
          <div v-if="song == editedSong">
            <form @submit.prevent="updateSong(song)">
              <div
                class="mb-6 p-4 bg-white rounded border border-grey-light mt-4"
              >
                <div class="mb-6">
                  <label for="">Title</label>
                  <input v-model="song.title" />
                </div>
                <div class="mb-6">
                  <label for="">Song</label>
                  <input v-model="song.year" />
                </div>
                <div class="mb-6">
                  <select id="artistUpdate" v-model="song.artist">
                    <option disabled value="">Select an Artist</option>
                    <option
                      :value="artist.id"
                      v-for="artist in artists"
                      :key="artist.id"
                    >
                      {{ artist.name }}
                    </option>
                  </select>
                </div>
                <input
                  type="submit"
                  value="Update"
                  class="bg-transparent text-sm hover:bg-blue-200 hover:text-white text-blue border-blue no-underline font-bold py-2 px-4 mr-2 rounded"
                />
              </div>
            </form>
          </div>
        </li>
      </ul>
    </form>
  </div>
</template>
