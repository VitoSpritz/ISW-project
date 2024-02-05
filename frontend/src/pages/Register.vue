<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import Modal from '../components/Modal.vue';
import { User } from '../types';

export default defineComponent({
  data() {
    return {
      user: null as User | null,
      username: "",
      password: "",
      email: "",
      isActive: false,
      msgError: "",
      pass: false
    }
  },
  components: {
    Modal
  },
  methods: {
    showModal() {
      this.isActive = !this.isActive;
    },

    checkPass() {
      var strength = 0;

      if (/[a-z]+/.test(this.password)) {
        strength += 1;
      }
      if (/[A-Z]+/.test(this.password)) {
        strength += 1;
      }
      if (/[0-9]+/.test(this.password)) {
        strength += 1;
      }
      if (/[$@#&!?]+/.test(this.password)) {
        strength += 1;
      }
      
      if (this.password.length < 6) {
        this.isActive = !this.isActive;
        this.msgError = "Password troppo corta";
        this.pass = false;
        return
      }

      switch (strength) {
        case 2:
          this.pass = true;
          break;

        case 3:
          this.pass = true;
          break;

        case 4:
          this.pass = true;
          break;
      }
    },

    async onSubmit(token: boolean) {

      if (this.username == "" || this.password == "" || this.email == "") {
        this.isActive = true;
        this.msgError = "Impossibile avere campi nulli";
      }
      else if(token == true) {
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
  mounted() {
    this.getUser()
  }
})
</script>

<template>
  <div v-if="isActive">
    <Modal @close="showModal" :message='msgError'></Modal>
  </div>
  <h2>Registrazione</h2>
  <form method="POST" @submit.prevent="checkPass(), onSubmit(pass)" class="registerForm">
    <ul>
      <li><label for="username">Username</label></li>
      <li>
        <input type="text" id="username" name="username" v-model="username"
          :disabled="user?.username != undefined ? true : false" required autocomplete="off" />
      </li>
      <li><label for="email">Email</label></li>
      <li>
        <input type="email" id="email" name="email" v-model="email" :disabled="user?.username != undefined ? true : false"
          required autocomplete="off" />
      </li>
      <li><label for="password">Password</label></li>
      <li>
        <input type="password" id="password" name="password" v-model="password"
          :disabled="user?.username != undefined ? true : false" required autocomplete="off" />
      </li>
      <li>
        <input type="submit" name="submit" value="Invia" :disabled="user?.username != undefined ? true : false" />
      </li>
    </ul>
  </form>
</template>

<style scoped>
form {
  height: auto;
}</style>