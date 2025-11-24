<script setup>
import SideNavBar from '../SideNavBar.vue';
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
    <div class="">


    </div>
</template>