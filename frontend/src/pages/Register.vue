<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import Modal from '../components/Modal.vue';

export default defineComponent({
  data() {
    return{
      username:"",
      password:"",
      email:"",
      isActive: false
    }
  },
  components:{
    Modal
  },
  methods: {
    showItems(){
      if(this.username != "" && this.email != "" && this.password != "" ){
        this.isActive = true;
      }
    },
    showModal(){
      this.isActive = !this.isActive;
    },
    async onSubmit() {
      try {
        await axios.post("/api/auth/register", {
          username: this.username,
          password: this.password,
          email : this.email
        })
        window.location.href = "/"
      } catch (e: any) {
        if (e.response) {
          this.isActive = true
        }
      }
    },
  }
})
</script>

<template>
  <div v-if="isActive">
    <Modal @close="showModal"></Modal>
  </div>
  <h2>Register</h2>
  <form method="POST" @click="showItems">
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
        <input type="button" name="submit" value="Invia" @click="onSubmit" />
      </li>
    </ul>
    
  </form>
  <p>Antonio {{ username }}</p>
</template>


<style scoped>
  form{
    height: auto;
  }
</style>