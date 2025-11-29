<script>
export default {
  name: "Songs",
  data() {
    return {
      artists: [],
      songs: [],
      user: {
        is_artist: false,
        artist_name: "",
      },
      newSong: {
        title: "",
        year: "",
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
      // ALWAYS fetch artists so we can display artist names
      this.fetchArtists();
    }
  },
  methods: {
    fetchUserProfile() {
      this.$securedAxios
        .get("/api/v1/user")
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          console.error("Failed to load user profile:", error);
        });
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
      if (artist) {
        return artist.name;
      }

      // If artist not found locally, check if this is the user's song
      if (this.user.is_artist && song.artist_id) {
        // For artists, we can use their artist_name as fallback
        return this.user.artist_name || "Your Artist Name";
      }

      return "Unknown Artist";
    },
    addSong() {
      const value = this.newSong;
      if (!value.title || !value.year) {
        this.error = "Please fill in title and year";
        return;
      }

      if (this.user.is_artist) {
        this.createSongForArtist();
      } else {
        this.createSongWithSelectedArtist();
      }
    },
    createSongForArtist() {
      this.findOrCreateUserArtist()
        .then((artistId) => {
          return this.$securedAxios.post("/api/v1/songs", {
            song: {
              title: this.newSong.title,
              year: this.newSong.year,
              artist_id: artistId,
            },
          });
        })
        .then((response) => {
          this.songs.push(response.data);
          this.newSong = { title: "", year: "" };
          this.error = "";
          // REFRESH artists to include the newly created one
          this.fetchArtists();
        })
        .catch((error) => this.setError(error, "Unable to create a new song"));
    },
    createSongWithSelectedArtist() {
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
          this.newSong = { title: "", year: "", artist: "" };
          this.error = "";
        })
        .catch((error) => this.setError(error, "Unable to create a new song"));
    },
    async findOrCreateUserArtist() {
      // First, try to find existing artist for this user
      const existingArtist = this.artists.find(
        (artist) => artist.user_id === this.user.id
      );
      if (existingArtist) {
        return existingArtist.id;
      }

      // If no artist exists, create one
      try {
        const response = await this.$securedAxios.post("/api/v1/artists", {
          artist: {
            name: this.user.artist_name || this.user.username,
            user_id: this.user.id,
          },
        });
        // Add the new artist to our local artists array
        this.artists.push(response.data);
        return response.data.id;
      } catch (error) {
        throw new Error("Failed to create artist record");
      }
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
    },
    updateSong(song) {
      this.$securedAxios
        .patch(`/api/v1/songs/${song.id}`, {
          song: {
            title: song.title,
            year: song.year,
            artist_id: song.artist_id,
          },
        })
        .then(() => {
          this.editedSong = null;
          this.error = "";
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

    <!-- Artist Header -->
    <div
      v-if="user.is_artist"
      class="mb-6 p-4 bg-purple-600 rounded text-white"
    >
      <h3 class="text-xl font-semibold mb-2">Create New Song</h3>
      <p>
        Your song will be credited to: <strong>{{ user.artist_name }}</strong>
      </p>
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

      <!-- Artist Selection - ONLY show for non-artists -->
      <div class="mb-6" v-if="!user.is_artist">
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
        <p class="pt-4 text-sm">
          Want to create songs as yourself?
          <router-link to="/beartist" class="text-blue-600 hover:underline">
            Become an Artist
          </router-link>
        </p>
      </div>

      <!-- For artists, show their fixed artist name -->
      <div class="mb-6" v-else>
        <label class="block mb-2 text-gray-600">Artist:</label>
        <div class="p-3 bg-gray-100 rounded border">
          <strong>{{ user.artist_name }}</strong>
          <p class="text-sm text-gray-500 mt-1">
            Your artist name is automatically used
          </p>
        </div>
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
            <span
              v-if="user.is_artist"
              class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mt-1 inline-block"
            >
              Your Song
            </span>
          </div>
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
      </li>
    </ul>
  </div>
</template>
