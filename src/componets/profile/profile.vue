<script setup>
    import sideBar from './sideBar.vue';
    import MainBody from '../MainBody.vue';
</script>

<script>
    export default {
        name: "Users",
        data() {
            return{
                user: {
                  username: '',
                  email: '',
                  password: '',
                  password_confirmation: ''
                },
                error: '',
                success: ''
                
            };
    },
     created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
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
        this.setError(error, "Failed to load user profile");
      });
    }
    },
    editUser(user){
        this.editedUser = user;
    },
    updateProfile() {
        this.error = '';
        this.success = '';

        this.$securedAxios
        .patch('/api/v1/user', {user: this.user })
        .then(response => {
          this.sucess = 'Profile Updated Secuccessfuly!'
          this.user.password = '';
          this.user.password_confirmation = '';
        })
        .catch(error => {
          this.setError(error, "failed to update profile");
        });
    },
    setError(error, text) {
      this.error =
      (error.response && error.response.data && error.response.data.errors) ||
      (error.response && error.response.data && error.response.data.error) ||
      text;
    }
}

</script>

<template>
    <sideBar/>
    <MainBody>
         <h2 class="text-2xl font-bold mb-4">Profile</h2>

    </MainBody>



</template>