<template lang="html">
  <div class="page">
    <div class="inputs">
      <input
        type="text"
        name=""
        value=""
        v-model="password"
        placeholder="Admin Password"
        class="mainInput"
      />
      <button v-on:click="fetchComments()" class="button1">
        Fetch Comments
      </button>
      <button type="button" v-on:click="banUser()" class="button1">
        Lockdown Service
      </button>
      <button v-on:click="endLockdown()" class="button1">End Lockdown</button>
    </div>

    <div class="messageDisplay">{{ message }}</div>
    <div class="commentHolder">
      <div class="comment" v-for="comment in comments" v-bind:key="comment._id">
        <div class="content">
          "{{ comment.comment }}" <br />
          by: {{ comment.suggestedBy }} - {{ comment.timeString }}
        </div>
        <div class="controls">
          <button
            type="button"
            name="button"
            v-on:click="clearSuggestion(comment._id)"
            class="goodButton"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="blank" v-for="blank in numBlank" v-bind:key="blank"></div>
    </div>
  </div>
</template>

<script>
const fetchURL = "/api/Manage/";
const banURL = "/api/Manage/Ban";
const unLockdown = "/api/Manage/unBan";
const axios = require("axios");
const moment = require("moment");
const sizeUnits = 5;
export default {
  data: function() {
    return {
      password: "",
      comments: [],
      message: ""
    };
  },
  methods: {
    async fetchComments() {
      console.log("Fetching!");
      let response = await axios.get(fetchURL + this.password);
      console.log(response.data.message);
      if (this.message == "") {
        this.message = response.data.message;
      }

      if (response.data.data) {
        if (response.data.data.length < 1 && this.message.length < 20) {
          this.message += " No Comments to display!";
        }
        this.comments = response.data.data;
        for (let comment of this.comments) {
          comment.timeString = moment.unix(comment.timeStamp).calendar();
        }
      }

      console.log(response);
    },
    async endLockdown() {
      let response = await axios.put(unLockdown, { password: this.password });
      this.message = response.message;
    },
    async clearSuggestion(id) {
      let response = await axios.put(fetchURL, {
        id: id,
        password: this.password
      });
      console.log(response);
      this.fetchComments();
    },
    async banUser() {
      let response = await axios.put(banURL, {
        password: this.password
      });
      this.message = response.data.message;
      this.fetchComments();
      console.log(response);
    }
  },
  computed: {
    numBlank: function() {
      return sizeUnits - this.comments.length;
    }
  }
};
</script>

<style lang="css" scoped>
* {
  margin: 0;
  padding: 0;
}

.messageDisplay {
  color: white;
  display: block;
  margin-top: 20px;
  font-size: 20px;
}
.inputs {
  margin-top: 20px;
  height: 35px;
  display: flex;
  justify-content: center;
}

.blank {
  height: 125px;
}

.button1 {
  text-decoration: underline;
  color: white;
  background-color: #0a80de;
  transition: all 0.4s;
  height: 50px;
  padding: 5px 5px;
  font-size: 25px;
  margin-left: 25px;
  border-radius: 5px;
}
.button1:hover {
  background-color: #81c218;
}

.mainInput {
  border-radius: 5px;
  height: 100%;
  font-size: 25px;
  height: 35px;
  margin: 0;
  background-color: #0a80de;
  color: white;
  padding: 5px;
}
::placeholder {
  color: white;
}

.content {
  width: 80%;
  font-size: 20px;
  color: white;
  text-align: left;
  padding: 10px;
}

.controls {
  width: 20%;
  align-self: flex-end;
}
.controls button {
  height: 60px;
  width: 90%;
  margin: 10px;
  background-color: #0a80de;
  color: white;
}

.goodButton:hover {
  background-color: #00ff00;
}

.badButton:hover {
  background-color: #ff0000;
}
.placeHolder {
  height: 600px;
}

.comment {
  border: 2px solid grey;
  margin: 10px;
}

.page {
  background-color: #2c3e50;
}
.commentHolder {
  width: 60%;
  margin: 0 auto;
}
.comment {
  display: flex;
  align-items: flex-start;
}

input {
  background-color: #cdcdcd;
}
button {
  background-color: #cdcdcd;
}
</style>
