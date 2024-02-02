<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
    data(){
        return{
            fine_sospensione: null as string | null
        }
    },
    props: ['isOwner', 'email', 'id', 'isMod'],
    methods:{
        closeModal(){
            this.$emit('close');
        },

        async banUser(){
            try{
                console.log("Franga " + this.fine_sospensione)
                await axios.post("/api/roles/banUser", {
                    email: this.email,
                    id: this.id,
                    fine_sospensione: this.fine_sospensione
                })
            }catch(e: any){
                console.log(e)
            }
        },

        async createMod(){
            try{
                console.log(this.email + " " + this.id)
                await axios.post(`/api/roles/createMod/${this.id}/${this.email}`)
            }catch(e: any){
                console.log(e)
            }
        },


        async deleteMod(){
            try{
                console.log("Welo belo " + this.id + " " +this.email)
                await axios.post(`/api/roles/deleteMod/${this.id}/${this.email}`)
            }catch(e: any){
                console.log(e)
            }
        }
    }
})
</script>

<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <template v-if="isOwner">
                <div class="banSection">
                    <p>Lo stiamolo banniamolo sto coglione di {{ email }} in chat {{ id }} ?</p>
                    <input type="datetime-local" id="BanDate" name="BanDate" v-model="fine_sospensione">
                    <input type="button" value="Invia" @click="banUser">
                </div>
                <div v-if="isOwner" class="modSection">
                    <p>Ha fatto il bravo sto negro di {{ email }} ? </p>
                    <input type="button" value="Si" id="modButton" name="modButton" @click="createMod()">
                    <input type="button" value="No" id="unmodButton" name="unmodButton" @click="deleteMod()" v-if="isMod">
                </div>
            </template>
            <template v-else>
                <div class="banSection">
                    <p>Lo stiamolo banniamolo sto coglione di {{ email }} in chat {{ id }}?</p>
                    <input type="datetime-local" id="BanDate" name="BanDate" v-model="fine_sospensione">
                    <input type="button" value="Invia" @click="banUser">
                </div>
            </template>
        </div>
    </div>
</template>


<style scoped>
    .modal{
        width: 400px;
        padding: 20px;
        margin: 100px auto;
        background: white;
        border-radius: 10px;
    }

    .backdrop{
        top: 0;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.6);
        width: 100%;
        height: 100%;
    }

    p{
        font-size: 15px;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
</style>