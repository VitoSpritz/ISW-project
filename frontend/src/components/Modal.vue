<template>
    <div class="backdrop" @click.self="closeModal">
        <div class="modal">
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    props: ['message'],
    methods:{
        closeModal(){
            this.$emit('close');
        }
    }
})
</script>

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