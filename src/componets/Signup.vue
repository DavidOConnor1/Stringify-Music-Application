<script>
export default {
  name: "Signup",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      error: "",
    };
  },
  created() {
    this.checkSignIn();
  },
  updated() {
    this.checkSignIn();
  },
  methods: {
    signup() {
      this.$plainAxios
        .post("/signup", {
          username: this.username,
          email: this.email,
          password: this.password,
          password_confirmation: this.passwordConfirmation,
        })
        .then((response) => this.signupSuccessful(response))
        .catch((error) => this.signupFailed(error));
    },
    signupSuccessful(response) {
      if (!response.data.csrf) {
        this.signupFailed(response);
        return;
      }
      localStorage.csrf = response.data.csrf;
      localStorage.signedIn = true;
      this.error = "";
      this.$router.replace("/songs");
    },
    signupFailed(error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response);
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        "Something went wrong. Please try again.";
      delete localStorage.csrf;
      delete localStorage.signedIn;
    },
    checkSignIn() {
      if (localStorage.signedIn) {
        this.$router.replace("/songs");
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div
      class="max-w-sm w-full bg-gray-300 p-10 border border-gray-200 shadow rounded"
    >
      <h3 class="text-2xl mb-6 text-gray-900">Sign Up</h3>
      <form @submit.prevent="signup">
        <!-- Make sure this matches the method name -->
        <div class="text-red-500" v-if="error">{{ error }}</div>

        <div class="mb-6">
          <label for="username" class="block mb-1 text-gray-700"
            >Username:</label
          >
          <input
            type="text"
            v-model="username"
            id="username"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="JohnDoeKnowsMoe"
          />
        </div>

        <div class="mb-6">
          <label for="email" class="block mb-1 text-gray-700">Email:</label>
          <input
            type="email"
            v-model="email"
            id="email"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="JohnDoe@email.com"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block mb-1 text-gray-700"
            >Password:</label
          >
          <input
            type="password"
            v-model="password"
            id="password"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <div class="mb-6" v-if="password.length > 0">
          <label for="passwordConfirmation" class="block mb-1 text-gray-700"
            >Confirm Password:</label
          >
          <input
            type="password"
            v-model="passwordConfirmation"
            id="passwordConfirmation"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          class="font-bold px-4 rounded cursor-pointer bg-gradient-to-b from-[#0072FF] to-[#00C853] w-full py-3 text-white"
        >
          Sign Up
        </button>

        <div class="my-4 text-center">
          <router-link to="/Signin" class="text-blue-600 hover:underline"
            >Sign In</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>
