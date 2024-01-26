<script lang="ts">
import { defineComponent } from "vue"
import axios from "axios"
import { Autore } from "../types"

export default defineComponent({
  data() {
    return {
      autori: [] as Autore[]
    }
  },
  methods: {
    getAutori: function(){
      axios.get("/api/autori").then(response => this.autori = response.data)
    }
  },
  mounted(){
    this.getAutori()
  }
})
</script>

<template>
  <h2>Autori del Blog</h2>
  <section>
    <table>
      <tr>
        <th id="autore">Autore</th>
        <th id="email">Email</th>
        <th id="argomenti">Argomenti</th>
      </tr>
      <tr v-for="autore in autori">
        <th>{{autore.nome}}</th>
        <td>{{autore.username}}</td>
        <td>{{autore.argomenti}}</td>
      </tr>
    </table>
  </section>
</template>
