<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
    data(){
        return{
            fine_sospensione: null as string | null
        }
    },
    props: ['isOwner', 'email', 'id', 'isMod', 'username'],
    methods:{
        closeModal(){
            this.$emit('close');
        },

        async banUser(){
            if(this.fine_sospensione != null){
                try{
                    await axios.post("/api/roles/banUser", {
                        email: this.email,
                        id: this.id,
                        fine_sospensione: this.fine_sospensione
                    })
                    this.$emit('updateBan')
                    this.closeModal()

                }catch(e: any){
                    console.log(e)
                }
            }
        },

        async createMod(){
            try{
                await axios.post(`/api/roles/createMod/${this.id}/${this.email}`)
                this.closeModal();
            }catch(e: any){
                console.log(e)
            }
        },


        async deleteMod(){
            try{
                await axios.post(`/api/roles/deleteMod/${this.id}/${this.email}`)
                this.closeModal();
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
                    <p>Vuoi bannare l'utente {{ username }} nella chat {{ id }} ?</p>
                    <input type="datetime-local" id="BanDate" name="BanDate" v-model="fine_sospensione" required>
                    <input type="button" value="Invia" @click="banUser()">
                </div>
                <div v-if="isOwner" class="modSection">
                    <p v-if="!isMod">Vuoi promuovere a moderatore l'utente {{ username }} ? </p>
                    <p v-else>Vuoi rimuovere il moderatore all'utente {{ username }}</p>
                    <input type="button" value="Si" id="modButton" name="modButton" @click="createMod()" v-if="!isMod">
                    <input type="button" value="Si" id="unmodButton" name="unmodButton" @click="deleteMod()" v-if="isMod">
                </div>
            </template>
            <template v-else>
                <div class="banSection">
                    <p>Vuoi bannare l'utente {{ username }} nella chat {{ id }}?</p>
                    <input type="datetime-local" id="BanDate" name="BanDate" v-model="fine_sospensione" required>
                    <input type="button" value="Invia" @click="banUser()">
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
        font-size: 19px;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }

    input:hover{
        cursor: pointer;
    }
</style>