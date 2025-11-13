<script setup>
import logo from "@/assets/img/logo.png";
</script>

<script>
export default {
  name: "Nav",
  created() {
    this.signedIn();
  },
  methods: {
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
    },
    signedIn() {
      return localStorage.signedIn;
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
          <a class="flex flex-shrink-0 items-center mr-4" href="index.html">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2"
              >Stringify</span
            >
          </a>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <router-link
                to="/"
                class="text-white bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >Home</router-link
              >
              <a
                href="jobs.html"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >Discover</a
              >
              <a
                href="add-job.html"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >Playlists</a
              >
              <router-link
                to="./Signin"
                class="text-white hover:bg-gradient-to-b from-[#0072FF] to-[#00C853] hover:text-white rounded-md px-3 py-2"
                >Sign Up/Login</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
