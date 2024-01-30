<script lang="ts">
import { defineComponent } from 'vue';
import io from "socket.io-client"
import { User, messageBody } from '../types';
import axios from 'axios';

export default defineComponent({
    data(){
        return{
            id: String,
            user: null as User | null,
            userList: [] as string[],
            messageInput: null as string | null,
            allMessages: [] as messageBody[],
            socket: io("http://localhost:3000")
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
        }
    },
    created(){
        
    },
    mounted(){
        this.getUser()
        this.receiveMessage()
        this.getUserList()
    }  
})
</script>

<template>
    <h2>Chat</h2>
    <p>Nome della room {{ $route.params.idChat }}</p>
    <div class="chat">
      <ul id="messages"></ul>
      <form class="chatForm" @submit.prevent="sendMessage">
        <ul>
            <li v-for="msg in allMessages" :key="msg.userId" :class="isCurrentuser(msg) ? 'right' : 'left'"> {{ !isCurrentuser(msg) ? msg.utente + ': ' + msg.message : msg.message }} </li>
                
        </ul>
        <div class="chatBar">
            <input id="m" type="text" autocomplete="off" placeholder="Scrivi un messaggio" v-model="messageInput"/>
            <button>Send</button>
        </div>
      </form>
    </div>
    <aside>
        <ul>
            <li v-for="user in userList">{{ user }}</li>
        </ul>
    </aside>
</template>

<style scoped>



    aside{
        background-color: peru;
        width: 10%;
        height: 60%;
    }
    .chatForm{
        margin-top: auto;
        width: 70%;
        align-items: end;
    }

    input{
        align-items: end;
    }
</style>