<script>


export default {
    name:'Signin',
    data () {
        return {
            username: '',
            email: '',
            password: '',
            error: ''
        }
    },
    created() {
        this.checkSignIn()
    },
    updated() {
        this.checkSignIn()
    },
    methods: {
        //take in the parameters provided from the form
        signin() {
            this.$http.plain.post('/signin', { username: this.username, email: this.email, password: this.password} )
            .then(response => this.signinSuccessful(response))
            .catch(error => this.signinFailed(error))
        },
        //log the user in when the sign in is successfull and load the songs page
        signinSuccessful(response) {
            if(!response.data.csrf){
                this.signinFailed(response)
                return
            } 
            localStorage.csrf = response.data.csrf
            localStorage.signedIn = true
            this.error = ''
            this.$router.replace('/songs')
        },
        //if sign in fails throw error and delete token
        signinFailed(error){
            this.error = (error.response && error.response.data && error.response.data.error) || ''
            delete localStorage.csrf
            delete localStorage.signedIn
        },
        //if the user is logged in just load the songs page
        checkSignIn () {
            if(localStorage.signedIn){
                this.$router.replace('/songs')
            }
        }
    }
}
</script>

<script setup>
import BodySections from './BodySections.vue';


</script>

<template>
  
   
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="max-w-sm w-full bg-white p-10 border border-gray-200 shadow rounded">
      <h3 class="text-2xl mb-6 text-gray-900">Sign In</h3>
      <form @submit.prevent="signin">
        <div class="text-red-500" v-if="error">{{ error }}</div>

        <div class="mb-6">
          <label for="username" class="block mb-1 text-gray-700">Username:</label>
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
          <label for="password" class="block mb-1 text-gray-700">Password:</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="font-bold px-4 rounded cursor-pointer bg-gradient-to-b from-[#0072FF] to-[#00C853] w-full py-3 text-white"
        >
          Sign In
        </button>

        <div class="my-4 text-center">
          <router-link to="/signup" class="text-blue-600 hover:underline">Sign Up</router-link>
        </div>
      </form>
    </div>
  </div>


   
</template>