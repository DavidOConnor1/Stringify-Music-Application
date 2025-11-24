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
        
        <template>
          <div class="max-w-md m-auto py-10">
            <div class="text-red-500 mb-4" v-if="error">
              <div v-if="Array.isArray(error)">
                <p v-for="err in error" :key="err">
                  {{ err }}
                </p>
                <div>
                  {{ error }}
                </div>
              </div>

              <div class="text-green-500 mb-4" v-if="success">
                {{ success }}
              </div>
            </div>
            
              <h2 class="text-2xl font-bold mb-4">Your Profile</h2>

              <form @submit.prevent="updateProfile">
                <div class="mb-6">
                  <label for="username" class="block mb-2 text-gray-700">Username:</label>

                </div>
              </form>


          </div>
        </template>
    </MainBody>



</template>