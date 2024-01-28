<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import Modal from '../components/Modal.vue';

export default defineComponent({
  components: {
    Modal
  },
  data() {
    return{
      password:"",
      email:"",
      isActive: false,
      msgError: ""
    }
  },
  methods: {
    showModal(){
      this.isActive = !this.isActive;
    },
    async onSubmit() {
      try {
        await axios.post("/api/auth/login", {
          email: this.email,
          password: this.password,
        })
        window.location.href = "/"
      } catch (e: any) {
        if (e.response) {
            this.isActive = true;
            this.msgError = e.response.status + " " + e.response.statusText + " - " + e.response.data;
          } else {
            this.msgError = e.message
          }
      }
    },
  }
})
</script>

<template>
    <h2>Login</h2>
    <div v-if="isActive">
      <Modal @close="showModal" :message='msgError' ></Modal>
    </div>
    <form @submit.prevent="onSubmit">
        <ul>
            <li>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" v-model="email"/>
            </li>
            <li>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" v-model="password"/>
            </li>
            <li>
                <input type="submit" name="submit" value="Invia" />
            </li>
        </ul>
    </form>
    <p>Se non sei registrato fallo <router-link to="/register" style="text-decoration: none; color: blue; cursor: pointer;">qui</router-link></p>
</template>

<style scoped>
    
    form{
        height: auto;
    }

    p{
        text-align: center;
        font-size: 20px;
    }
</style>