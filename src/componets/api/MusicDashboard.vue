<script>
export default{
    name: 'MusicDashboard',
    data(){
        return{
            featuredArtists: [],
            newReleases: [],
            userPlaylists: [],
            loading: {
                artists: true,
                releases: true,
                playlists: true
            },
            activeSection: 'artists' //default active section
        }
    },
    async mounted() {
        await this.loadDashboardData()
    },
    
}
</script>

<template>

</template>