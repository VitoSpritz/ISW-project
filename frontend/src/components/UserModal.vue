<script lang="ts">
import axios from 'axios';
import { PropType, defineComponent } from 'vue';
import { User } from '../types';

export default defineComponent({
    props: {
        user: Object as PropType<User>,
    },
    methods:{
        closeModal(){
            this.$emit('close');
        },
        async logout() {
            await axios.post("/api/auth/logout")
            window.location.reload()
        },
    }
})
</script>

<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <p @click.self="logout" >Logout</p>
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

    .modal p{
        width: fit-content;
        cursor: pointer;
        color: red;
        font-size: 15px;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
</style>