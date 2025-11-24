<script setup>
import SideNavBar from '../SideNavBar.vue';
import Features from '../Features.vue';
</script>

<script>
export default {
    name: 'ArtistUpgrade', // Fixed typo: was 'AristUpgrade'
    data() {
        return{
            user: {
                is_artist: false,
                artist_name: ''
            },
            artistName: '', // ADD THIS - it was missing!
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
        upgradeToArtist() { // Fixed typo: was 'upgradeToArist'
            this.error = '';
            this.success = '';

            // ADD artist_name parameter - it was missing!
            this.$securedAxios
            .post('/api/v1/upgrade_to_artist', { artist_name: this.artistName })
            .then(response => {
                this.success = response.data.message || 'Congratulations on Becoming a Stringify Artist';
                this.user.is_artist = true;
                this.user.artist_name = this.artistName; // Update the displayed name
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
};
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
                    <router-link to="/beartist" >
                        Become An Artist
                    </router-link>
                </div>
                </Features>

                <Features>
                <div class="text-white hover:text-blue-300 transition-colors">
                    <router-link to="/song" >
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
                    
                    <div class="mb-4">
                        <label class="block text-white mb-2">Your Artist Name:</label>
                        <input
                            type="text"
                            v-model="artistName"
                            class="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter your artist name"
                            required
                        />
                    </div> <!-- Fixed: moved closing div to proper place -->
                    
                    <button
                        @click="upgradeToArtist"
                        :disabled="!artistName"
                        class="w-full bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Become an Artist
                    </button>
                </div>

                <div v-else class="p-6 bg-green-900 rounded-lg">
                    <h3 class="text-white text-2xl font-semibold mb-2">Welcome Artist</h3>
                    <p class="text-green-300 mb-2">Artist Name: <strong>{{ user.artist_name }}</strong></p>
                    <p class="text-green-300 mb-4"> <!-- Fixed typo: was 'texxt-green-300' -->
                        Your music is gaining traction with the Stringify Users
                    </p>

                    <div class="flex space-x-4">
                        <router-link to="/song"
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