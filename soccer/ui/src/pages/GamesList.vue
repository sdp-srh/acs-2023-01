<template>
  <div class="row">
    <div class="col-12">
      
      <card :title="title" :subTitle="subTitle">
        <div slot="raw-content" class="table-responsive">
          <paper-table :data="matches" :columns="columns">
          </paper-table>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { PaperTable } from "@/components";
export default {
  components: {
    PaperTable,
  },
  data() {
    return {
      title: "Matches",
      subTitle: "All Matches",
      columns: ["team1", "goals1", " versus ", "team2", "goals2"],
      matches: []
    };
  },
  methods: {
    async fetchGames() {
      try {
        const response = await fetch('/api/match');
        const data = await response.json();
        console.log(data)
        this.matches = data
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchGames();
  }
};
</script>
<style></style>
