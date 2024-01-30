<script lang="ts">
import { defineComponent } from "vue"
import Modal from '../components/Modal.vue';
import { User } from "./types";
import axios from "axios";
import UserModal from "./components/UserModal.vue"


export default defineComponent({
    components:{
        UserModal
    },
    data(){
        return{
            user: null as User | null,
            isActive: false
        }
    },
    methods:{
        async getUser() {
            const res = await axios.get("/api/auth/profile")
            this.user = res.data
        },
        showUserInfo(){
            this.isActive = !this.isActive;
        }
    },
    mounted(){
        this.getUser()
    }
})
</script>

<template>
    <nav>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/stanze">Stanze</router-link></li>
            <li v-if="user" @click="showUserInfo" class="userLi">Benvenuto {{ user.username }}</li>
            <template v-else>
                <li><router-link to="/login">Login</router-link></li>
            </template>
        </ul>
    </nav>
    <UserModal v-if="isActive" @close="showUserInfo"/>
    <RouterView></RouterView>
</template>


<style>
    .userLi{
        width: fit-content;
        cursor: pointer;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    }
</style>