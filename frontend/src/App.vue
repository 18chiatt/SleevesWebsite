<template>
  <div id="app">
    <div class="top">
      <a href="/"><img src="@/assets/largeLogo.jpg" title="We ❤ Sleeves!"/></a>
      <div id="nav">
        <router-link to="/">Browse</router-link>
        <router-link to="Suggest">Suggest</router-link>
        <router-link to="Moderate">Moderate</router-link>
        <router-link to="About">Learn More</router-link>
      </div>
    </div>

    <router-view />
    <div class="footer">
      <div class="linkContainer">
        <div class="footerLink">
          <a href="https://github.com/18chiatt/SleevesWebsite">Github</a>
        </div>
        <div class="footerLink">
          <a href="https://sleevekings.com/">Main Website</a>
        </div>
        <div class="footerLink">
          <a href="https://sleevekings.com/pages/privacy-policy"
            >Privacy Policy</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

* {
  padding: 0;
  margin: 0;
  transition: 0.3s;
}
img {
  max-width: 12%;
}
#app {
  font-family: "Oswald", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #2c3e50;
  height: 100%;
}

router-link {
}

.footer {
  display: flex;
  width: 100%;
  background-color: #0a80de;
  justify-content: center;
  border-top: 1px solid black;
}

.linkContainer {
  display: flex;
  width: 60%;
  justify-content: space-between;
}
.footerLink {
  width: 100%;
  background-color: #0a80de;
}

.footerLink a {
  font-size: 30px;
  color: #ffffff;
}

.footerLink:hover {
  background-color: #81c218;
}
.footerLink a:hover {
  background-color: #81c218;
}

.footerLink a:visited {
  color: #ffffff;
}

#nav {
  width: 100%;
  background-color: #0a80de;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
}

#nav a {
  color: white;
  font-size: 50px;
  width: 100%;
  background-color: #0a80de;
}

#nav a:hover {
  background-color: #81c218;
}

#nav a.router-link-exact-active {
  color: #cdcdcd;
}
@media only screen and (max-width: 900) {
  #nav a {
    font-size: 10px;
  }
  .footerLink a {
    font-size: 10px;
  }
}
</style>
