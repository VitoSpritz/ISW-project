<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import { room } from '../types';


export default defineComponent({
    data(){
        return{
            roomName: "",
            imgsrc: null as File | null,
            isActive: false,
            toggle: false,
            msgError: "",
            roomList: [] as room[]
        }
    },
    methods:{
        async createRoom(){
            try {
                await axios.post("/api/room/createRoom", {
                roomname: this.roomName
                })
                this.toggleDiv()
            } catch (e: any) {
                if (e.response) {
                    console.error("Erore : ", e);
                    this.isActive = true;
                    this.msgError = e.response.status + " " + e.response.statusText + " - " + e.response.data;
                } else {
                    this.msgError = e.message
                }
            }
        },
        // savePath(e: any){
        //     var files = e.target.files || e.dataTransfer.files;
        //     if(!files)
        //         return;
        //     this.imgsrc = files[0];
        //     console.log(this.imgsrc);
        // },
        toggleDiv(){
            this.toggle = !this.toggle
        },
        async getAllRooms(){
            const res = await axios.get("/api/room/getAllRooms");
            this.roomList = res.data;
        }
    },
    mounted(){
        this.getAllRooms();
    }
})

</script>

<template>
    <h2>Stanze</h2>
    <div class="roomsDiv">
        <p>Iniza creaundo una nuova stanza, oppure unisci a una già esistente</p>
        <button class="createRoom" @click="toggleDiv()">Crea una stanza</button>
        <template v-if="toggle">
            <Transition name="slide-fade" appear>
                <div>
                    <form @submit.prevent="createRoom(); getAllRooms()">
                        <label for="room">Nome camera</label><br>
                        <input type="text" id="room" v-model="roomName" required><br>
                        <input type="submit" value="Crea">
                    </form>
                </div>
            </Transition>
        </template>
        <ul>
            <li v-for="room in roomList" :key="room.id"> {{ room.id }} {{ room.roomName }} <button class="enterRoom">Entra</button></li>
            <!-- <li>{{ room.id }} </li> -->
            <!-- <li>Attand <button class="enterRoom">Entra</button></li> -->
        </ul>
    </div>
</template>

<style scoped>
    input{
        margin: 5px auto;
    }

    label{
        font-size: 18px;
    }

    .slide-fade-enter-active {
    transition: all 0.5s ease-out;
    }

    .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
    }

</style>