<script>
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
                    <label for="email" >Email: </label>
                    <input type="email" v-model="email" id="email" placeholder="JohnDoe@email.com">
                    <label for="password">Password: </label>
                    <input type="text" v-model="password" id="password" placeholder="SuperSecretPassword123">
                </div>
            </form>
        </div>
    </div>
</template>