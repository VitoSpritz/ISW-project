<template>
    <div class="backdrop" @click="closeModal">
        <div class="modal">
            <p>Erorr</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    methods:{
        closeModal(){
            this.$emit('close');
        }
    }
})
</script>

<style>
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
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
    }
</style>