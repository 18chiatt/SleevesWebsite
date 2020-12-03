<template lang="html">
  <div class="page">
    <input
      type="text"
      v-model="query"
      v-on:keyup="getGames()"
      value=""
      placeholder="Search"
    />
    <div class="Prompt" v-show="games.length === 0">
      Games will appear here when you type!
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
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
const URL = "api/Games/";
export default {
  data: function() {
    return {
      query: "",
      games: []
    };
  },
  methods: {
    getGames: async function() {
      axios.get(URL + this.query).then(response => {
        console.log(response.data);
        this.games = response.data;
      });
    }
  }
};
</script>

<style lang="css" scoped>
* {
  background-color: #cdcdcd;
}
.page {
  width: 100%;

  background-color: #cdcdcd;
  padding: 20px;
}
.sneaky {
  display: inline;
}

.Prompt {
  height: 600px;
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
