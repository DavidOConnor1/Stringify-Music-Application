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
    methods: {
    async loadDashboardData() {
        try{
            //loading featured artists
            const artistsResponse = await this.$plainAxios.get('/api/v1/music/featured_artists')
            this.featuredArtists = artistsResponse.data.artists
            this.loading.artists = false;

            //loading new release songs
            const releasesResponse = await this.$plainAxios.get('/api/v1/music/new_releases')
            this.newReleases = releasesResponse.data.songs
            this.loading.releases = false

            //load user playlists
            const playlistsResponse = await this.$plainAxios.get('/api/v1/playlists')
            this.userPlaylists = playlistsResponse.data
            this.loading.playlists = false
        } catch (error) {
            console.error('Failed to load dashboard: ', error)
            this.loading.artists = false
            this.loading.releases = false
            this.loading.playlists = false
        }
    },
    formatDuration(ms){
        if(!ms) return '0:00'
        const minutes = Math.floor(ms/60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },

    setActiveSection(section) {
        this.activeSection = section
    },

    addToPlaylist(song) {
        this.$emit('add-to-playlist', song)
        console.log(`Added "${song.title}" to playlist`)
    }
    }
}
</script>

<template>

</template>