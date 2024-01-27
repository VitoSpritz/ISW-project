<script lang="ts">
import { defineComponent } from "vue"
import NavigationBar from "./components/NavigationBar.vue"

export default defineComponent({

})
</script>

<template>
    <nav>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/stanze">Stanze</router-link></li>
            <li><router-link to="/login">Login</router-link></li>
        </ul>
    </nav>
    <RouterView></RouterView>
</template>
