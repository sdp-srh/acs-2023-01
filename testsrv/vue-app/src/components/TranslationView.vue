<template>
  <h2>English ⇄ German</h2>
  <div class="container">
    <button @click="clear">Reset</button>
    <div>
      <textarea id="enTextArea" v-model="text.english" placeholder="Enter English text" cols="25" rows="12"></textarea>
    </div>
    <div>
      <button :disabled="!text.english" @click="translateToGerman" id="en2deButton">To German</button>
      <br>
      <button :disabled="!text.german" @click="translateToEnglish" id="de2enButton">To English</button>
    </div>
    <div>
      <textarea id="deTextArea" v-model="text.german" placeholder="Hier den deutschen Text eingeben" cols="25"
        rows="12"></textarea>
    </div>
  </div>

</template>

<style scoped>
textarea { font-size: 18px; }

.container {

  justify-content: center;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  /* switched from default (flex-start, see below) */
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  font-weight: bold;
  color: blue;
}
</style>



<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TranslationView',
  data() {
    return {
      text: {
        english: "",
        german: ""
      }
    };
  },
  methods: {
    async translateToGerman() {
      try {
        console.log(this.text.english)
        const payload = { source: this.text.english }
        const response = await fetch('/api/en2de', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
        const result = await response.json();
        this.text.german = result.translation;
      } catch (error) {
        console.error(error);
      }
    },

    async translateToEnglish() {
      try {
        console.log(this.text.german)
        const payload = { source: this.text.german }
        const response = await fetch('/api/de2en', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
        const result = await response.json();
        this.text.english = result.translation;
      } catch (error) {
        console.error(error);
      }
    },
    clear() {
      this.text.english = ''
      this.text.german = ''
    }
  },
})
</script>
