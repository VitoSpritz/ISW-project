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
  <h2>Register</h2>
  <template v-if="user">
    <form method="POST" @submit.prevent="onSubmit">
      <ul>
        <li>
          <label for="username">Username</label>
          <input type="text" id="username" name="username" v-model="username" disabled="true" />
        </li>
        <li>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" v-model="email" disabled="true" />
        </li>
        <li>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" v-model="password" disabled="true" />
        </li>
        <li>
          <input type="submit" name="submit" value="Invia" disabled="true" />
        </li>
      </ul>
    </form>
  </template>

  <template v-else>
    <form method="POST" @submit.prevent="onSubmit">
      <ul>
        <li>
          <label for="username">Username</label>
          <input type="text" id="username" name="username" v-model="username" />
        </li>
        <li>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" v-model="email"/>
        </li>
        <li>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" v-model="password" />
        </li>
        <li>
          <input type="submit" name="submit" value="Invia"/>
        </li>
      </ul>
    </form>
  </template>
</template>


<style scoped>
  form{
    height: auto;
  }
</style>