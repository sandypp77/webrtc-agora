<script setup>
import callpage from "../stores/callpage.js";
import room_rtc from "../../Server/room_rtc.js";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const emit = defineEmits([
  "startAudio",
  "stopAudio",
  "startVideo",
  "stopVideo",
  "startScreen",
  "stopScreen",
  "exitButton",
]);

function startAudio() {
  emit("startAudio");
  callpage.value.startAudioButton = false;
  callpage.value.stopAudioButton = true;
}
function stopAudio() {
  emit("stopAudio");
  callpage.value.startAudioButton = true;
  callpage.value.stopAudioButton = false;
}
function startVideo() {
  emit("startVideo");
  callpage.value.startVideoButton = false;
  callpage.value.stopVideoButton = true;
}
function stopVideo() {
  emit("stopVideo");
  callpage.value.startVideoButton = true;
  callpage.value.stopVideoButton = false;
}
function startScreen() {
  emit("startScreen");
  // callpage.value.startScreenButton = false;
  // callpage.value.stopScreenButton = true;
}
function stopScreen() {
  emit("stopScreen");
  // callpage.value.startScreenButton = true;
  // callpage.value.stopScreenButton = false;
}
function exitButton() {
  emit("exitButton");
}
function backToHome() {
  router
    .push({
      name: "home",
    })
    .catch((err) => {
      throw new Error(`Problem handling something: ${err}.`);
    });
}

function currentDate() {
  const current = new Date();
  const date = `${current.getHours()}.${current.getMinutes()}`;
  return date;
}
</script>

<template>
  <div class="footer-item">
    <div class="center-item">
      <div
        class="icon-block"
        @click="startAudio()"
        v-show="callpage.startAudioButton"
      >
        <font-awesome-icon
          icon="fa-solid fa-microphone-slash"
          style="color: #e51010"
          class="icon"
        />
      </div>
      <div
        class="icon-block"
        @click="stopAudio()"
        v-show="callpage.stopAudioButton"
      >
        <font-awesome-icon
          icon="fa-solid fa-microphone"
          style="color: var(--message-text)"
          class="icon"
        />
      </div>
      <div
        class="icon-block"
        @click="startVideo()"
        v-show="callpage.startVideoButton"
      >
        <font-awesome-icon
          icon="fa-solid fa-video-slash"
          style="color: #e51010"
          class="icon"
        />
      </div>
      <div
        class="icon-block"
        @click="stopVideo()"
        v-show="callpage.stopVideoButton"
      >
        <font-awesome-icon
          icon="fa-solid fa-video"
          style="color: var(--message-text)"
          class="icon"
        />
      </div>
      <div
        class="icon-block"
        @click="startScreen()"
        v-show="callpage.startScreenButton"
      >
        <font-awesome-icon
          icon="fa-solid fa-display"
          style="color: #e51010"
          class="icon"
        />
      </div>

      <div
        class="icon-block"
        @click="stopScreen()"
        v-show="callpage.stopScreenButton"
      >
        <font-awesome-icon
          icon="fa-solid fa-display"
          style="color: var(--message-text)"
          class="icon"
        />
      </div>
      <div class="icon-block" @click="exitButton()">
        <font-awesome-icon
          icon="fa-solid fa-phone"
          class="icon"
          style="color: #e51010"
        />
      </div>
    </div>
  </div>
</template>

<style>
.footer-item {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5.5rem;
  z-index: 1;
  background-color: var(--chat-background);
  width: calc(100vw - 25.3rem);
}
.footer-item .left-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 350px;
}
.footer-item .left-item .icon-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
}
.footer-item .left-item .icon-block .icon {
  margin-left: 10px;
  font-size: 20px;
}
.footer-item .left-item .icon-block:hover {
  cursor: pointer;
  background: #eee;
}
.footer-item .center-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.footer-item .center-item .icon-block {
  background-color: var(--button-bg);
  /* border: 1px solid #dfdfdf; */
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}
.footer-item .center-item .icon-block .icon {
  color: #fff;
  font-size: 16px;
}
.footer-item .center-item .icon-block .icon.red {
  color: #d93025;
}
.footer-item .center-item .icon-block:hover {
  cursor: pointer;
  box-shadow: 0 0 10px #ddd;
}
.footer-item .center-item .icon-block.red-bg {
  background: #d93025;
}
.footer-item .center-item .icon-block.red-bg .icon {
  color: #fff;
}
.footer-item .right-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 350px;
}
.footer-item .right-item .icon-block {
  /* background-color: rgb(60,64,67); */
  /* border: 1px solid #dfdfdf; */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}
.footer-item .right-item .icon-block .icon {
  color: var(--message-text);
  font-size: 24px;
}
.footer-item .right-item .icon-block .title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}
.footer-item .right-item .icon-block:hover {
  cursor: pointer;
  /* box-shadow: 0 0 10px #ddd; */
}
.date-block {
  font-size: 22px;
  color: #fff;
  min-width: 50px;
  font-weight: 400;
}
/* .alert-circle-icon {
  position: absolute;
  background: #04796a;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
  top: 22px;
  right: 122px;
} */
</style>
