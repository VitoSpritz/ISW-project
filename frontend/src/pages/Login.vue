<script lang="ts">
import { formToJSON } from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return{
      password:"",
      email:"",
      isActive: false
    }
  },
  methods: {
    showItems(){
      if(this.email != "" && this.password != "" ){
        this.isActive = true;
      }
    }
  }
})
</script>

<template>
    <h2>Login</h2>
    <form method="POST">
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