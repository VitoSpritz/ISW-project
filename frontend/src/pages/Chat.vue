<script lang="ts">
import { defineComponent } from 'vue';
import io from "socket.io-client"
import { User, messageBody, Moderator, roomOwner, bannedUser } from '../types';
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
            banList: [] as bannedUser[],
            isActive: false,
            mods: [] as Moderator[],
            showBin: false,
            joinId: 0
        }
    },
    methods:{
        joinRoom(){
            this.socket.emit('joinRoom', this.$route.params.idChat, this.user?.username);
        },

        sendMessage(){
            if(this.messageInput != "" && this.messageInput != null && this.messageInput != " "){
                this.socket.emit('sendMessage', { roomName: this.$route.params.idChat, message: this.messageInput, utente: this.user?.username});
                this.messageInput = "";
            }
            
        },

        receiveMessage() {
            this.socket.on('messageReceived', (data: messageBody) => {
                this.allMessages.push(data);
        })},

        getUserList(){
            this.socket.on('userList',(users: string[]) => {
            this.userList = users;
            console.log(users)
        })
        
        },

        isCurrentuser(msg: messageBody){
            return this.user?.username == msg.utente
        },

        sendHead(){
            const joinUser : messageBody = {
                userId: "0",
                message: this.user?.username + " è entrato",
                utente: "chat",
                showimg: false,
                messageId: this.joinId
            }
            this.socket.emit("sendMessage", { roomName: this.$route.params.idChat, message: joinUser.message, utente: "chat"});
        },

        async getUser(){
            const res = await axios.get("/api/auth/profile")
            this.user = res.data
            if(this.user?.username != undefined){
                this.joinRoom();
                this.sendHead()
            }else{
                this.$router.push('/');
            }
        },

        async getBannedUsers(){
            const res = await axios.get("/api/roles/banned");
            this.banList = res.data;
            
            let email = ""
            try{
                const res = await axios.get(`/api/auth/profile/${this.user?.username}`)
                email = res.data[0].email
            }catch(e: any){
                console.log("Utente non trovato")
            }
            
            for(const ban of this.banList){

                if(email == ban.email && this.idChat == ban.id){
                    this.$router.push("/");
                }
            }
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

        async getUserParams(username: string | null | undefined){
            const res = await axios.get(`/api/auth/profile/${username}`)
            this.email = res.data[0].email
        },

        isOwnerParam(username: string | null){
            for(const singleRoom of this.roomList){
                if(singleRoom.roomCreator == this.email && singleRoom.id == this.idChat){
                    return true
                }
            }
            return false
        },

        activateModal(){
            this.isActive = !this.isActive;
            this.getMods();
        },

        getText(event: MouseEvent){
            const target = event.target as HTMLLIElement;
            this.text= target.textContent;
            this.activateModal();
            this.getUserParams(this.text);
        },

        rimuoviMessaggio(messageId: number, msg: messageBody) {
            msg.showimg = false;
            this.socket.emit('rimuoviMessaggio', { roomName: this.$route.params.idChat, messageId });
        },

        rightClick(event: any, msg: messageBody){
            if(event.button == 2){
                msg.showimg = !msg.showimg
            }
        },

        touchBin( msg: messageBody){
            msg.showimg = !msg.showimg
        },

        getName(){
            for(const room of this.roomList){
                if(this.idChat == room.id){
                    return room.roomName
                }
            }
        }
    },

    mounted(){
        this.idChat = this.$route.params.idChat[2] == undefined || null ? this.$route.params.idChat[1] : this.$route.params.idChat[1] + this.$route.params.idChat[2],
        this.getMods(),
        this.receiveMessage(),
        this.getUserList(),
        this.getOwner()

        this.socket.on('messaggioRimosso', (data) => {
            this.allMessages = this.allMessages.filter(msg => msg.userId !== data.messageId);
        })

        this.socket.on('messaggiAggiornati', (updatedMessages) => {
            this.allMessages = updatedMessages;
        });
        
    },
    created(){
        this.getUser()
        this.getBannedUsers()
    }
})
</script>

<template>
    <h2> {{ getName() }}</h2>
    
    <div class="chat">
        <aside>
            <p>Utenti registrati</p>
            <ul>
                <li v-for="user in userList" @click="getText" :class="isMod(idChat, user) ? 'mod' : ''"> {{ user }}</li>
            </ul>
        </aside>
      
        <form class="chatForm" @submit.prevent="sendMessage">
            <div class="chatContainer">
                <ul>
                    <li v-for="(msg) in allMessages" :key="msg.userId" :class="msg.utente == 'chat' ? 'center' : (isCurrentuser(msg) ? 'right' : 'left')" @contextmenu.prevent="rightClick($event, msg)" @touchstart="touchBin(msg)">
                        <img v-if="isCurrentuser(msg) && msg.showimg && isMod(idChat, user?.username) && msg.utente != 'chat' " src="../public/bin.png" class="bin" @click="rimuoviMessaggio(msg.messageId, msg)" 
                        > 
                        {{ msg.utente == 'chat' ? msg.message : (!isCurrentuser(msg) ? msg.utente + ': ' + msg.message : msg.message) }}
                        <img v-if="!isCurrentuser(msg) && msg.showimg && isMod(idChat, user?.username) && msg.utente != 'chat' " src="../public/bin.png" class="bin" @click="rimuoviMessaggio(msg.messageId, msg)"
                        >
                    </li>
                </ul>
            </div>
            <div class="chatBar" style="box-sizing: border-box;">
                <input id="m" type="text" autocomplete="off" placeholder="Scrivi un messaggio" v-model="messageInput"/>
                <button>Send</button>
            </div>
        </form>
    </div>
    <div v-if="isActive && isMod(idChat, user?.username) && text != user?.username && (!isOwnerParam(text) && isMod(idChat, user?.username))">
        <ModsModal :isOwner = isOwner() :isMod="isMod(idChat, text)" :email="email" :username="text" @close="activateModal()" @updateBan="getBannedUsers()" :id="idChat"></ModsModal>
    </div>
    
</template>

<style scoped>
    input{
        align-items: end;
    }
</style>