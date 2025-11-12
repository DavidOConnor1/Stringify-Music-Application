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
        signin() {
            this.$http.plain.post('/signin', { username: this.username, email: this.email, password: this.password} )
            .then(response => this.signinSuccessful(response))
            .catch(error => this.signinFailed(error))
        },
        signinSuccessful() {
            this.$http.secured.post('/signin')
        }
    }
}
</script>

<template>
    <div class="max-w-sm m-auto my-8">
        <div class="border p-10 border-grey-light shadow rounded">
            <h3 class="text-2xl mb-6 text-grey:900">Sign In</h3>
            <form @submit.prevent="signin">
                <div class="text-red" v-if="Error">{{ error }}</div>
                <div class="mb-6">
                    <label for="username">Username: </label>
                    <input type="text" v-model="username" id="username" placeholder="JohnDoeKnowsMoe">
                </div>

                <div class="mb-6">
                    <label for="email" >Email: </label>
                    <input type="email" v-model="email" id="email" placeholder="JohnDoe@email.com">
                </div>

                <div class="mb-6">
                    <label for="password">Password: </label>
                    <input type="text" v-model="password" id="password" placeholder="SuperSecretPassword123">
               </div>
               <button type="submit" class="font-bold px-4 rounded cursor-pointer no-underline bg-gradient-to-b from-[#0072FF] to-[#00C853] block w-full py-4 text-white items-center justify-center">
                Sign In
               </button>

               <div class="my-4">
                <router-link to="/signup" class="">Sign Up</router-link>
               </div>
            </form>
        </div>
    </div>
</template>