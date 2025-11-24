<script setup>
import SideNavBar from '../SideNavBar.vue';
import Features from '../Features.vue';
</script>

<script>
export default {
    name: 'AristUpgrade',
    data() {
        return{
            user: {
                is_artist: false
            },
            error: '',
            success: ''
        };
    },
    created() {
        if(!localStorage.signedIn){
            this.$router.replace('/')
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
                this.setError(error, 'Failed to load Profile');
            });
        },
        upgradeToArist(){
            this.error = '';
            this.success = '';

            this.$securedAxios
            .post('/api/v1/upgrade_to_artist')
            .then(response => {
                this.success = response.data.message || 'Congratulations on Becoming a Stringify Artist';
                this.user.is_artist = true;
            })
            .catch(error => {
                this.setError(error, 'Failed to upgrade to an artist');
            });
        },
        setError(error, text){
            this.error = 
            (error.response && error.response.data && error.response.data.errors) ||
            (error.response && error.response.data && error.response.data.error) ||
            text;
        }

    }
} ;
</script>


<template>
    <div class="min-h-screen bg-gray-800 flex">
        <SideNavBar>
            <div class="flex flex-col space-y-4">
                <!--Profile Settings-->
                <Features>
                <div class="text-white hover:text-blue-300 transition-colors">
                    <router-link to="/profile" >
                        Profile Settings
                    </router-link>
                </div>
                </Features>

                <!--Becoming an Artists-->
                <Features>
                <div class="text-white hover:text-blue-300 transition-colors">
                    <router-link to="/beArtist" >
                        Become An Artist
                    </router-link>
                </div>
                </Features>

                <Features>
                <div class="text-white hover:text-blue-300 transition-colors">
                    <router-link to="/songs" >
                        Create Music
                    </router-link>
                </div>
                </Features>

            </div>
        </SideNavBar>

        <!--Becoming a Stringify Artist-->

        <div class="flex-1 py-10">
            <div class="max-w-md m-auto">
                <div class="text-red-500 mb-4" v-if="error">
                    {{ error }}
                </div>

                <div class="text-green-500 mb-4" v-if="success">
                    {{ success }}
                </div>

                <!--Interacting with the logic-->

                <div class="p-6 bg-gray-700 rounded-lg" v-if="!user.is_artist">
                    <h3 class="text-white text-2xl font-semibold mb-4">Become a Stringify Artist</h3>
                    <p class="text-gray-300 mb-4">
                        Upgrade to a Stringify Artist Account and share your sound with the world!
                        Your Songs will gather user traction from our home page promotion!
                    </p>
                   <button class="w-full bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 px-4 rounded transition-colors">
                    Upgrade to Artist
                   </button>
                </div>

                <div v-else class="p-6 bg-green-900 rounded-lg">
                    <h3 class="text-white text-2xl font-semibold mb-2">Welcome Artist</h3>
                    <p class="texxt-green-300 mb-4">
                        Your music is gaining traction with the Stringify Users
                    </p>

                    <div class="flex space-x-4">
                        <router-link to="/songs"
                         class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                            Manage Songs
                        </router-link>

                        <router-link to="/" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                            View Your Songs
                        </router-link>

                    </div>

                </div>

            </div>
        </div>
        

    </div>
</template>