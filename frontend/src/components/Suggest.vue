<template lang="html">
  <div class="page">
    <div class="thanks" v-show="response != 0">{{ response }}</div>
    <h1>Type a Suggestion here</h1>
    <textarea
      name="name"
      rows="8"
      cols="80"
      v-model="comment"
      placeholder="Comment here"
    ></textarea>
    <input
      type="text"
      name=""
      v-model="name"
      value=""
      placeholder="Your Name here"
    />
    <button type="button" name="button" v-on:click="sendComment()">
      Submit
    </button>
  </div>
</template>

<script>
const postURL = "/api/Suggest/";
let axios = require("axios");
export default {
  data: function() {
    return {
      comment: "",
      name: "",
      response: 0
    };
  },
  methods: {
    sendComment: async function() {
      let comment = { comment: this.comment, suggestedBy: this.name };

      let response = await axios.post(postURL, comment);
      console.log(response);
      this.response = response.data.message;
      this.comment = "";
      this.name = "";
    }
  },
  created() {}
};
</script>

<style lang="css" scoped>
.thanks {
  color: white;
  margin-top: 10px;
}
.page {
  background-color: #2c3e50;
  height: 600px;
}

.prompt {
  display: inline;
}

textarea {
  display: block;
  margin: 0 auto;
  border-radius: 5px;
  padding: 10px;
  background-color: #0a80de;
  color: white;
}

::placeholder {
  color: white;
}

input {
  background-color: #0a80de;
  font-size: 20px;
  height: 30px;
  margin-top: 10px;
  border-radius: 5px;
  padding: 3px;
  color: white;
}

button {
  margin-left: 30px;
  height: 30px;
  background-color: #0a80de;
  color: white;

  width: 100px;
}
</style>
