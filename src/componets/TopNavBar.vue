<script setup>
import logo from "@/assets/img/logo.png";
import { watch } from "vue";
</script>

<script>
export default {
  name: "Nav",
  data(){
    return {
      isAuthenticated: false
    };
  },
  created() {
    this.checkAuthStatus();
    //setting up this to detect server reloads
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  methods: {
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
    },
    checkAuthStatus() {
      this.isAuthenticated = !!localStorage.signedIn && !!localStorage.csrf;
    },
    signOut() {
      this.$http.secured
        .delete("signin")
        .then((response) => {
          delete localStorage.csrf;
          delete localStoragw.signedIn;
          this.$router.replace("/");
        })
        .catch((error) => this.setError(error, "cannot sign out"));
    },
    clearAuthData() {
      delete localStorage.csrf;
      delete localStorage.signedIn;
      this.isAuthenticated = false;
    },
    handleBeforeUnload() {
      //stores a timestamp when a user leaves the page
      sessionStorage.setItem('lastActivity', Date.now().toString());
    },
    checkServerConnection(){
      //checks is the server is still responsive
      this.$plainAxios.get('/')
      .catch(() => {
        //if the server is unreachable
        this.clearAuthData();
      });
    },
    watch : {
      //watch for route changes to update auth status
      '$route'(){
        this.checkAuthStatus();
      }
    }
  },
};
</script>

<template>
  <nav
    class="bg-gray-800 border-b border-gradient-to-b from-[#0072FF] to-[#00C853]"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <router-link class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2"
              >Stringify</span
            >
          </router-link>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <router-link
                to="/"
                class="text-white bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >Home</router-link
              >
              <router-link
                to="/artist"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >Discover</router-link
              >
              <router-link
                to="/song"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >Playlists</router-link
              >
              <template v-if="!isAuthenticated">
              <router-link
                to="./Signin"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >Sign Up/Login</router-link
              >
                </template>

              <template v-else>
              <router-link to="/profile"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >
                Profile
              </router-link>

              <button
              @click="signOut"
              class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2">
                Sign Out
              </button>


              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
