<script setup>
import SideNavBar from "../navigation/SideNavBar.vue";
import Features from "../navigation/Features.vue";
</script>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_artist: false,
        artist_name: ''
      },
      error: '',
      success: ''
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
    } else {
      this.fetchUserProfile();
    }
  },
  methods: {
    fetchUserProfile() {
      this.$securedAxios
        .get('/api/v1/user')
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          this.setError(error, "Failed to load profile");
        });
    },
    updateProfile() {
      this.error = '';
      this.success = '';

      this.$securedAxios
        .patch('/api/v1/user', { user: this.user })
        .then(response => {
          this.success = 'Profile updated successfully!';
          this.user.password = '';
          this.user.password_confirmation = '';
        })
        .catch(error => {
          this.setError(error, "Failed to update profile");
        });
    },
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.errors) ||
        (error.response && error.response.data && error.response.data.error) ||
        text;
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-800 flex">
    <!-- Sidebar -->
    <SideNavBar>
      <h2 class="text-lg font-bold mb-4 text-white">Options</h2>
      <div class="flex flex-col space-y-4">
        <!-- Settings -->
        <Features>
          <div class="text-white hover:text-blue-300 transition-colors">
            <router-link to="/profile"> Settings </router-link>
          </div>
        </Features>
        <!-- Become an Artist -->
        <Features>
          <div class="text-white hover:text-blue-300 transition-colors">
            <router-link to="/beartist"> Become an Artist </router-link>
          </div>
        </Features>
      </div>
    </SideNavBar>

    <!-- Main Content -->
    <div class="flex-1 py-10">
      <div class="max-w-md m-auto">
        <div class="text-red-500 mb-4" v-if="error">
          <div v-if="Array.isArray(error)">
            <p v-for="err in error" :key="err">{{ err }}</p>
          </div>
          <div v-else>
            {{ error }}
          </div>
        </div>

        <div class="text-green-500 mb-4" v-if="success">
          {{ success }}
        </div>

        <h3 class="text-white font-mono font-regular text-3xl mb-4">
          Your Profile
        </h3>

        <form @submit.prevent="updateProfile">
          <div class="mb-6">
            <label for="username" class="block mb-2 text-white"
              >Username:</label
            >
            <input
              type="text"
              id="username"
              v-model="user.username"
              class="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div class="mb-6">
            <label for="email" class="block mb-2 text-white">Email:</label>
            <input
              type="email"
              id="email"
              v-model="user.email"
              class="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div class="mb-6" v-if="user.is_artist">
            <label for="artist_name" class="block mb-2 text-white"
              >Artist Name:</label
            >
            <input
              type="text"
              id="artist_name"
              v-model="user.artist_name"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Your artist name"
            />
            <p class="text-gray-400 text-sm mt-1">
              This name appears on your public songs
            </p>
          </div>

          <div class="mb-6">
            <label for="password" class="block mb-2 text-white"
              >New Password (leave blank to keep current):</label
            >
            <input
              type="password"
              id="password"
              v-model="user.password"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter new password"
            />
          </div>

          <div class="mb-6" v-if="user.password">
            <label for="password_confirmation" class="block mb-2 text-white"
              >Confirm New Password:</label
            >
            <input
              type="password"
              id="password_confirmation"
              v-model="user.password_confirmation"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            class="font-bold px-4 rounded cursor-pointer no-underline bg-gradient-to-b from-[#0072FF] to-[#00C853] block py-4 text-white items-center justify-center w-full"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
