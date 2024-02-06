<script lang="ts">
import axios, { formToJSON } from 'axios';
import { defineComponent } from 'vue';
import Modal from '../components/Modal.vue';
import { User } from '../types';

export default defineComponent({
  components: {
    Modal
  },
  data() {
    return {
      password: "",
      email: "",
      isActive: false,
      msgError: "",
      user: null as User | null
    }
  },
  methods: {
    showModal() {
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
          this.password = "";
          this.msgError = e.response.statusText + " - " + e.response.data;
        } else {
          this.msgError = e.message
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
  <h2>Login</h2>
  <div v-if="isActive">
    <Modal @close="showModal" :message='msgError'></Modal>
  </div>
  <form @submit.prevent="onSubmit" class="registerForm">
    <ul>
      <li><label for="email">Email</label></li>
      <li>
        <input type="email" id="email" name="email" v-model="email" :disabled="user?.username != undefined"
          autocomplete="off" required/>
      </li>
      <li><label for="password">Password</label></li>
      <li>
        <input type="password" id="password" name="password" v-model="password" :disabled="user?.username != undefined"
          autocomplete="off" required/>
      </li>
      <li>
        <input type="submit" name="submit" value="Invia" :disabled="user?.username != undefined" />
      </li>
    </ul>
    <p>Se non sei registrato fallo <router-link to="/register">qui</router-link>!</p>
  </form>
</template>