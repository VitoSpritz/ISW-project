<script lang="ts">
import { formToJSON } from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
  data() {
    return{
      username:"",
      password:"",
      email:"",
      isActive: false
    }
  },
  methods: {
    showItems(){
      if(this.username != "" && this.email != "" && this.password != "" ){
        this.isActive = true;
      }
    }
  }
})
</script>



<template>
  <h2>Register</h2>
  <form action="" method="POST" @click="showItems">
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
        <input type="submit" name="submit" value="Invia" />
      </li>
    </ul>
  </form>
  <h2 v-if="isActive"> Antonioooooo {{ username }}</h2>
</template>


<style scoped>
  form{
    height: auto;
  }
</style>