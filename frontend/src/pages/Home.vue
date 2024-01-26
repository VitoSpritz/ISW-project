<script lang="ts">
import { defineComponent } from "vue"
import axios from "axios"
import { Articolo } from "../types"

export default defineComponent({
  data() {
    return {
      datiArticoli: [] as Articolo[]
    }
  },
  methods: {
    getUltimiArticoli() {
      axios.get("api/articoli/2").then(response => this.datiArticoli = response.data)
    }
  },
  mounted() {
    this.getUltimiArticoli()
  }
})
</script>

<template>
  <h2>Ultimi Articoli</h2>
  <article v-for="articolo in datiArticoli">
    <img :src="'/img/' + articolo.imgarticolo" alt="" />
    <h3>{{articolo.titoloarticolo}}</h3>
    <p>{{articolo.nome}} - {{articolo.dataarticolo.slice(0, 10)}}</p>
    <p>{{articolo.anteprimaarticolo}}</p>
    <a href="#">Leggi tutto</a>
  </article>
</template>
