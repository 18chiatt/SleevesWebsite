<template lang="html">
  <div class="page">
    <input
      v-model="query"
      v-on:keyup="getGames()"
      value=""
      placeholder="Search"
      class="inputBox"
    />
    <div class="Prompt" v-show="games.length === 0">
      {{ message }}
    </div>
    <div class="mainContent">
      <div v-for="game in games" :key="game._id" class="gameHolder">
        <h2>{{ game.name }}</h2>
        <div
          class="sleeveSize"
          v-for="size in game.sizes"
          v-bind:key="size.count"
        >
          <a :href="size.link"
            >{{ size.count }}
            <div class="sneaky" v-show="!size.count">Unknown count</div>
            of {{ size.name }}</a
          >
        </div>
      </div>

      <div
        class="blanks"
        v-for="blank in this.numBlanks"
        v-bind:key="blank"
      ></div>
    </div>
  </div>
</template>

<script>
const numSlots = 5;
const axios = require("axios").default;
const URL = "api/Games/";
export default {
  data: function() {
    return {
      query: "",
      games: [],
      message: "Games will appear here when you type"
    };
  },
  methods: {
    getGames: async function() {
      let query = encodeURI(this.query);
      axios.get(URL + query).then(response => {
        console.log(response.data);
        this.games = response.data;
        if (this.games.length === 0) {
          this.message = "Unable to find matching game";
        }
      });
    }
  },
  computed: {
    numBlanks: function() {
      return numSlots - this.games.length;
    }
  }
};
</script>

<style lang="css" scoped>
* {
  background-color: #2c3e50;
  color: white;
}

.blanks {
  height: 125px;
}

input {
  color: white;
  background-color: #0a80de;
  border: 2px solid #0a80de;
  border-radius: 5px;
  padding: 5px;
  font-size: 30px;
}

::placeholder {
  color: white;
}

.page {
  background-color: #2c3e50;
  padding: 20px;
}
.sneaky {
  display: inline;
}

.Prompt {
}

.mainContent {
  flex-direction: column;
}

.gameHolder {
  width: 60%;
  margin: 0 auto;
  padding: 0 auto;
  justify-content: center;
  border: 1px solid black;
  padding: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
}

li {
  display: inline;
}
h2 {
  display: inline;
}
</style>
