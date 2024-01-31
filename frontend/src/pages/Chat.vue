<script lang="ts">
import { defineComponent } from 'vue';
import io from "socket.io-client"
import { User, messageBody, Moderator, roomOwner } from '../types';
import axios, { getAdapter } from 'axios';
import Modal from '../components/Modal.vue';
import ModsModal from "../components/ModsModal.vue"

export default defineComponent({
    components:{
        Modal,
        ModsModal
    },
    data(){
        return{
            text: null as string | null,
            email: null as string | null,
            user: null as User | null,
            roomList: [] as roomOwner[],
            idChat: "",
            userList: [] as string[],
            messageInput: null as string | null,
            allMessages: [] as messageBody[],
            socket: io("http://localhost:3000"),
            isActive: false,
            mods: [] as Moderator[],
        }
    },
    methods:{
        joinRoom(){
            this.socket.emit('joinRoom', this.$route.params.idChat, this.user?.username);
        },

        sendMessage(){
            this.socket.emit('sendMessage', { roomName: this.$route.params.idChat, message: this.messageInput, utente: this.user?.username});
            this.messageInput = "";
        },

        receiveMessage() {
            this.socket.on('messageReceived', (data: messageBody) => {
                this.allMessages.push(data);
        })},

        getUserList(){
            this.socket.on('userList',(users: string[]) => {
            this.userList = users;
        })},

        isCurrentuser(msg: messageBody){
            return this.user?.username == msg.utente
        },

        async getUser(){
            const res = await axios.get("/api/auth/profile")
            this.user = res.data
            this.joinRoom()
        },

        async getMods(){
            const res = await axios.get("/api/roles/mods")
            this.mods = res.data;
        },

        isMod(id: string , username: string | undefined | null){
            
            for(const mod of this.mods){
                if(username == mod.user && mod.id == id){
                    return true
                }
            }
            return false
        },

        async getOwner(){
            const res = await axios.get("/api/room/roomOwners")
            this.roomList = res.data
        },

        isOwner(){
            for(const singleRoom of this.roomList){
                if(singleRoom.roomCreator == this.user?.email && singleRoom.id == this.idChat){
                    return true
                }
            }
            return false
        },

        async getUserParams(username: string | null){
            const res = await axios.get(`/api/auth/profile/${username}`)
            this.email =  res.data[0].email
        },

        isOwnerParam(username: string | null){
            console.log(this.email)
            for(const singleRoom of this.roomList){
                if(singleRoom.roomCreator == this.email && singleRoom.id == this.idChat){
                    return true
                }
            }
            return false
        },

        activateModal(){
            this.isActive = !this.isActive
        },

        getText(event: MouseEvent){
            const target = event.target as HTMLLIElement;
            this.text= target.textContent;
            this.activateModal(),
            this.getUserParams(this.text)
        },

    },

    mounted(){
        this.idChat = this.$route.params.idChat[2] == undefined || null ? this.$route.params.idChat[1] : this.$route.params.idChat[1] + this.$route.params.idChat[2],
        this.getMods(),
        this.getUser(),
        this.receiveMessage(),
        this.getUserList(),
        this.getOwner()
    },
})
</script>

<template>
    <h2>Chat numero {{ idChat }}</h2>
    <h2 v-if="isOwner()"> Sono il capo di art attack</h2>
    
    <div class="chat" >
        <aside>
            <p>Utenti registrati</p>
            <ul>
                <li v-for="user in userList" :class="isMod(idChat , user) ? 'mod' : '' " @click="getText" >{{ user }}</li>
            </ul>
        </aside>

      <ul id="messages"></ul>
      <form class="chatForm" @submit.prevent="sendMessage">
        <ul>
            <li v-for="(msg, index) in allMessages" :key="msg.userId" :class="isCurrentuser(msg) ? 'right' : 'left'"> {{ !isCurrentuser(msg) ? msg.utente + ': ' + msg.message : msg.message }} </li>
                
        </ul>
        <div class="chatBar">
            <input id="m" type="text" autocomplete="off" placeholder="Scrivi un messaggio" v-model="messageInput"/>
            <button>Send</button>
        </div>
      </form>
    </div>
    <div v-if="isActive && isMod(idChat, user?.username) && text != user?.username && (!isOwnerParam(text) && isMod(idChat, user?.username))">
        <ModsModal :isOwner = isOwner() :text="text" @close="activateModal()" ></ModsModal>
    </div>
    
</template>

<style scoped>
    input{
        align-items: end;
    }
</style>