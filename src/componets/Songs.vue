<script>
export default {
  name: "Songs",
  data() {
    return {
      artists: [],
      songs: [],
      user: {
        is_artist: false,
        artist_name: ''
      },
      newSong: {
        title: "",
        year: "",
        artist: "",
      },
      error: "",
      editedSong: null,
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
    } else {
      this.fetchUserProfile();
      this.fetchSongs();
      this.fetchArtists();
    }
  },
  methods: {
    fetchUserProfile() {
      this.$securedAxios
        .get('/api/v1/user')
        .then(response => {
          this.user = response.data;
          // If user is an artist, find and auto-select their artist
          if (this.user.is_artist) {
            this.findAndSelectUserArtist();
          }
        })
        .catch(error => {
          console.error("Failed to load user profile:", error);
        });
    },
    findAndSelectUserArtist() {
      // Wait for artists to load, then find the user's artist
      if (this.artists.length > 0) {
        const userArtist = this.artists.find(artist => artist.user_id === this.user.id);
        if (userArtist) {
          this.newSong.artist = userArtist.id;
        }
      }
    },
    fetchSongs() {
      this.$securedAxios
        .get("/api/v1/songs")
        .then((response) => {
          this.songs = response.data;
        })
        .catch((error) =>
          this.setError(
            error,
            "An error has occurred when trying to connect to the backend"
          )
        );
    },
    fetchArtists() {
      this.$securedAxios
        .get("/api/v1/artists")
        .then((response) => {
          this.artists = response.data;
          // After artists load, try to auto-select user's artist
          if (this.user.is_artist) {
            this.findAndSelectUserArtist();
          }
        })
        .catch((error) =>
          this.setError(
            error,
            "An error has occurred when trying to connect to the backend"
          )
        );
    },
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
    },
    getArtist(song) {
      const artist = this.artists.find(
        (artist) => artist.id === song.artist_id
      );
      return artist ? artist.name : "Unknown Artist";
    },
    addSong() {
      const value = this.newSong;
      if (!value.title || !value.year || !value.artist) {
        this.error = "Please fill in all fields";
        return;
      }

      this.$securedAxios
        .post("/api/v1/songs", {
          song: {
            title: this.newSong.title,
            year: this.newSong.year,
            artist_id: this.newSong.artist,
          },
        })
        .then((response) => {
          this.songs.push(response.data);
          // Reset form but keep artist selected if user is an artist
          this.newSong = { 
            title: "", 
            year: "", 
            artist: this.user.is_artist ? this.newSong.artist : "" 
          };
          this.error = ""; // Clear error on success
        })
        .catch((error) => this.setError(error, "Unable to create a new song"));
    },
    removeSong(song) {
      if (confirm(`Are you sure you want to delete "${song.title}"?`)) {
        this.$securedAxios
          .delete(`/api/v1/songs/${song.id}`)
          .then((response) => {
            this.songs = this.songs.filter((s) => s.id !== song.id);
          })
          .catch((error) =>
            this.setError(error, "Unable to delete the song at this time")
          );
      }
    },
    editSong(song) {
      this.editedSong = song;
      // Initialize the artist for editing
      song.artist = song.artist_id;
    },
    updateSong(song) {
      this.$securedAxios
        .patch(`/api/v1/songs/${song.id}`, {
          song: {
            title: song.title,
            year: song.year,
            artist_id: song.artist,
          },
        })
        .then(() => {
          this.editedSong = null; // Close edit form
          this.error = ""; // Clear error on success
        })
        .catch((error) =>
          this.setError(error, "Unable to update song at this time")
        );
    },
    cancelEdit() {
      this.editedSong = null;
      this.error = "";
    },
  },
};
</script>

<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red-500 mb-4" v-if="error">
      {{ error }}
    </div>
    <div v-if="user.is_artist" class="mb-4 p-3 bg-purple-600 rounded text-white">
      What songs do you have in store: <strong>{{ user.artist_name }}</strong>
    </div>
    <h3 class="font-mono font-regular text-3xl mb-4">Add a New Song</h3>
    <form @submit.prevent="addSong">
      <div class="mb-6">
        <label for="song_title" class="block mb-2">Title:</label>
        <input
          type="text"
          id="song_title"
          autofocus
          autocomplete="off"
          placeholder="Type a song name"
          v-model="newSong.title"
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div class="mb-6">
        <label for="song_year" class="block mb-2">Year:</label>
        <input
          type="text"
          id="song_year"
          autocomplete="off"
          placeholder="Year"
          v-model="newSong.year"
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div class="mb-6">
        <label for="artist" class="block mb-2">Artist:</label>
        <select
          id="artist"
          v-model="newSong.artist"
          class="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option disabled value="">Select an Artist</option>
          <option :value="artist.id" v-for="artist in artists" :key="artist.id">
            {{ artist.name }}
          </option>
        </select>
        <p class="pt-4 text-sm" v-if="!user.is_artist">
          Is your favorite artist not there?
          <router-link to="/beartist" class="text-blue-600 hover:underline">
            Become an Artist
          </router-link>
        </p>
        <p class="pt-4 text-sm text-green-600" v-else>
          Your Artist Profile is Automatically selected
        </p>
      </div>
      <button
        type="submit"
        class="bg-transparent text-sm hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500 no-underline font-bold py-2 px-4 rounded cursor-pointer"
      >
        Add Song
      </button>
    </form>

    <hr class="border border-gray-300 my-6" />

    <ul class="list-reset mt-4">
      <li
        class="py-4 border-b border-gray-200"
        v-for="song in songs"
        :key="song.id"
      >
        <div class="flex items-center justify-between flex-wrap">
          <div class="flex-1 pr-4">
            <p class="font-mono font-semibold text-lg">
              {{ song.title }} &mdash; {{ song.year }}
            </p>
            <p class="font-mono text-gray-600">{{ getArtist(song) }}</p>
          </div>
          <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
          v-if="user.is_artist && song.artist_id === newSong.artist">
          Your Song
          </span>
          <div class="flex space-x-2">
            <button
              class="bg-transparent text-sm hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500 no-underline font-bold py-2 px-4 rounded"
              @click.prevent="editSong(song)"
            >
              Edit
            </button>

            <button
              class="bg-transparent text-sm hover:bg-red-500 hover:text-white text-red-500 border border-red-500 no-underline font-bold py-2 px-4 rounded"
              @click.prevent="removeSong(song)"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div
          v-if="song === editedSong"
          class="mt-4 p-4 bg-gray-50 rounded border border-gray-300"
        >
          <form @submit.prevent="updateSong(song)">
            <div class="mb-4">
              <label class="block mb-2">Title</label>
              <input
                v-model="song.title"
                class="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2">Year</label>
              <input
                v-model="song.year"
                class="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2">Artist</label>
              <select
                v-model="song.artist"
                class="w-full border border-gray-300 rounded px-3 py-2"
              >
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
            <div class="flex space-x-2">
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
