<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
    data(){

    },
    methods:{
        async createRoom(){
            // try {
            //     await axios.post("/api/auth/login", {
            //     email: this.email,
            //     password: this.password,
            //     })
            // } catch (e: any) {
            //     if (e.response) {
            //         this.isActive = true;
            //         this.msgError = e.response.status + " " + e.response.statusText + " - " + e.response.data;
            //     } else {
            //         this.msgError = e.message
            //     }
            // }
        }
    }
})

</script>

<template>
    <h2>Stanze</h2>
    <div class="roomsDiv">
        <p>Iniza creaundo una nuova stanza, oppure unisci a una già esistente</p>
        <button class="createRoom" @click="createRoom">Crea una stanza</button>
        <ul>
            <li>Mamt e ataand <button class="enterRoom">Entra</button></li>
            <li>Attand <button class="enterRoom">Entra</button></li>
        </ul>
    </div>

</template>