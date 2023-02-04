<template>
  <div class="row">
    <h1>Teams</h1>
  
      <div class="col-12">
        <div v-for="(result,i) in teams" :key="i" class="col-sm-6" >
          <!--<p>{{ result.name }}</p>-->
          <card :title="result.name" :subTitle="result.id"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      teams: []
    };
  },
  methods: {
    async fetchTeams() {
      try {
        const response = await fetch('/api/team');
        this.teams = await response.json();
        console.log(this.teams)
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchTeams();
  }
};
</script>
<style></style>
