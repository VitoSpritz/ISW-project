<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import Modal from '../components/Modal.vue';
import { User } from '../types';

export default defineComponent({
  data() {
    return{
      user: null as User | null,
      username:"",
      password:"",
      email:"",
      isActive: false,
      msgError: ""
    }
  },
  components:{
    Modal
  },
  methods: {
    showModal(){
      this.isActive = !this.isActive;
    },
    async onSubmit() {
      if(this.username == "" || this.password == "" || this.email == ""){
          this.isActive = true;
          this.msgError = "Impossibile avere campi nulli";
      }
      else{
        try {
          await axios.post("/api/auth/register", {
            username: this.username,
            password: this.password,
            email: this.email
          })
          window.location.href = "/"
        } catch (e: any) {
          if (e.response) {
            this.password = "";
            this.isActive = true;
            this.msgError = e.response.status + " " + e.response.statusText + " - " + e.response.data;
          } else {
            this.msgError = e.message
          }
        }
      }
    },
    async getUser() {
      const res = await axios.get("/api/auth/profile")
      this.user = res.data
    },
  },
  mounted(){
    this.getUser()
  }
})
</script>

<template>
  <div v-if="isActive">
    <Modal @close="showModal" :message='msgError' ></Modal>
  </div>
  <h2>Registrazione</h2>
    <form method="POST" @submit.prevent="onSubmit" class="registerForm">
      <ul>
        <li><label for="username">Username</label></li>
        <li>
          <input type="text" id="username" name="username" v-model="username" :disabled="user?.username != undefined ? true : false" required autocomplete="off"/>
        </li>
        <li><label for="email">Email</label></li>
        <li>
          <input type="email" id="email" name="email" v-model="email" :disabled="user?.username != undefined ? true : false" required autocomplete="off"/>
        </li>
        <li><label for="password">Password</label></li>
        <li>
          <input type="password" id="password" name="password" v-model="password" :disabled="user?.username != undefined ? true : false" required autocomplete="off"/>
        </li>
        <li>
          <input type="submit" name="submit" value="Invia" :disabled="user?.username != undefined ? true : false" />
        </li>
      </ul>
    </form>
</template>

<style scoped>
  form{
    height: auto;
  }
</style>