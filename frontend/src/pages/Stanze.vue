<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import { bannedUser, room, roomOwner, User } from '../types';
import io, { Socket } from "socket.io-client"
import Modal from '../components/Modal.vue';

export default defineComponent({
    components:{
        Modal
    },
    data(){
        return{
            socket: io("http://localhost:3000"),
            user: null as User | null,
            roomName: "",
            // imgsrc: null as File | null,
            isActive: false,
            toggle: false,
            msgError: "",
            roomList: [] as room[],
            roomOwners: [] as roomOwner[],
            banList: [] as bannedUser[]
        }
    },
    methods:{
        async createRoom(){
            try {
                await axios.post("/api/room/createRoom", {
                roomname: this.roomName
                })
                this.RegisterRoom()
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

        RegisterRoom(){
            this.socket.emit('createRoom', this.roomName);
        },

        toggleDiv(){
            this.toggle = !this.toggle
        },

        async getAllRooms(){
            const res = await axios.get("/api/room/getAllRooms");
            this.roomList = res.data;
        },

        async getOwner(){
            const res = await axios.get("/api/room/roomOwners")
            this.roomOwners = res.data
        },

        async getBannedUsers(){
            const res = await axios.get("/api/roles/banned");
            this.banList = res.data;
        },

        async getUser(){
            const res = await axios.get("/api/auth/profile")
            this.user = res.data
        },

        checkBans(roomId: string){
            for(const ban of this.banList){
                if(ban.id.toString() == roomId && ban.email == this.user?.email){
                    const today = new Date();
                    if(ban.fine_sospensione > today.toISOString()){
                        const time = this.formatDateTime(ban.fine_sospensione)
                        this.msgError = "Sei stato bannato fino al: " + time;
                        return true
                    }else{
                        this.deleteUser(ban.id, ban.email)
                    }
                }
            }
        },

        async deleteUser(id: string, email: string){
            await axios.post(`/api/roles/delete/${id}/${email}`)
        },

        changePage(e: string){
            this.$router.push("/chat/:" + e);
        },

        showModal(){
            this.isActive = !this.isActive;
        },
        
        formatDateTime(dateTime: string): string {
            return new Date(dateTime).toLocaleString();
        },

        async deleteRoom(id: string){
            await axios.post(`/api/rooms/deleteRoom/${id}`)
            this.$router.push('/stanze');
        }
    },
    mounted(){
        this.getUser();
        this.getAllRooms();
        this.getBannedUsers();
        this.getOwner();
    },
    created(){
        this.getUser();
    }
})
</script>

<template>
    <h2>Stanze</h2>
    <div class="roomsDiv">
        <p v-if="user?.username != undefined">Iniza creando una nuova stanza, oppure unisciti a una già esistente</p>
        <p v-else>Non hai effettuato l'acceso, fallo <router-link to="/register">qui</router-link> per poter iniziare a chattare! </p>
        <button v-show="user?.username != undefined" class="createRoom" @click="toggleDiv()">
            
            Crea una stanza</button>
        <template v-if="toggle">
            <Transition name="slide-fade" appear>
                <div v-if="user?.username != undefined" class="createRoomDiv">
                    <form @submit.prevent="createRoom(); getAllRooms()">
                        <label for="room">Nome camera</label><br>
                        <input type="text" id="room" v-model="roomName" required autocomplete="off"><br>
                        <input type="submit" value="Crea">
                    </form>
                </div>
            </Transition>
        </template>
        <ul>
            <li v-for="room in roomOwners" :key="room.id" :class="checkBans(room.id) ? 'ban' : ''">
                <span class="roomName">Stanza <span>{{ room.roomName }}</span></span>
                <button class="enterRoom" @click=" !checkBans(room.id) ? changePage(room.id) : showModal()" >Entra</button>
                <button v-if="user?.email == room.roomCreator" class="deleteRoom" @click="deleteRoom(room.id)">Elimina</button>
                
            </li>
        </ul>
    </div>
    <div v-if="isActive">
        <Modal @close="showModal()" :message="msgError" ></Modal>
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