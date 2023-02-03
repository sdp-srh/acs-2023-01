<template>
  <div>
    <h2>Google Search Trends ({{ trends.length }})</h2>
    <ul v-if="trends.length">
      <li v-for="trend in trends">
        {{ trend.Top_Term}} ({{ trend.Day.value }})
      </li>
    </ul>
  </div>
</template>

<style>
li {
  list-style-type: none;
}
</style>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'GoogleTrendsView',
  data() {
    return {
      trends: []
    };
  },
  methods: {
    async fetchTrends() {
      try {
        const response = await fetch('/api/google-trends');
        const data = await response.json();
        console.log(data)
        this.trends = data.results
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchTrends();
  }
});
</script>