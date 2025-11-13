<script>
export default {
    name: 'Signin',
    data() {
        return {
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
            this.$plainAxios.post('/signin', { 
                email: this.email, 
                password: this.password 
            })
            .then(response => this.signinSuccessful(response))
            .catch(error => this.signinFailed(error))
        },
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
        signinFailed(error) {
            console.error('Signin error:', error)
            console.error('Error response:', error.response)
            this.error = (error.response && error.response.data && error.response.data.error) || 
                        'Invalid email or password. Please try again.'
            delete localStorage.csrf
            delete localStorage.signedIn
        },
        checkSignIn() {
            if(localStorage.signedIn){
                this.$router.replace('/songs')
            }
        }
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
        <div class="max-w-sm w-full bg-gray-300 p-10 border border-gray-200 shadow rounded">
            <h3 class="text-2xl mb-6 text-gray-900">Sign In</h3>
            <form @submit.prevent="signin">
                <div class="text-red-500 mb-4" v-if="error">{{ error }}</div>

                <div class="mb-6">
                    <label for="email" class="block mb-1 text-gray-700">Email:</label>
                    <input
                        type="email"
                        v-model="email"
                        id="email"
                        class="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="john@email.com"
                        required
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
                        required
                    />
                </div>

                <button
                    type="submit"
                    class="font-bold px-4 rounded cursor-pointer bg-gradient-to-b from-[#0072FF] to-[#00C853] w-full py-3 text-white"
                >
                    Sign In
                </button>

                <div class="my-4 text-center">
                    <router-link to="/signup" class="text-blue-600 hover:underline">Don't have an account? Sign Up</router-link>
                </div>
            </form>
        </div>
    </div>
</template>