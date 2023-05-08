<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FooterComponent from "../components/FooterComponent.vue";
import callpage from "../stores/callpage.js";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import room_rtc from "../../Server/room_rtc.js";
import room from "../../Server/room.js";
import { onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import room_rtm from "../../Server/room_rtm";

let roomRtc = null;
let roomRtm = null;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
const route = useRoute();
const router = useRouter();
let nameInput = route.params.nameInput;
let roomIdInput = route.params.roomIdInput;

onMounted(async () => {
  await router.isReady();

  let roomClass = new room(stream__box, streams__container);
  roomRtc = new room_rtc(
    AgoraRTC,
    AgoraRTM,
    streams__container,
    stream__box,
    nameInput,
    roomIdInput,
    route,
    router
  );
  roomOpen();

  window.addEventListener("resize", handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function handleResize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  if (screenWidth > 768) {
    callpage.value.rightSideIsOpened = true;
  } else {
    callpage.value.rightSideIsOpened = false;
  }
}

function roomOpen() {
  callpage.value.startAudioButton = false;
  callpage.value.stopAudioButton = !callpage.value.startAudioButton;
  callpage.value.startVideoButton = false;
  callpage.value.stopVideoButton = !callpage.value.startVideoButton;
  callpage.value.startScreenButton = true;
  callpage.value.stopScreenButton = !callpage.value.startScreenButton;
  callpage.value.exitButton = true;
  callpage.value.copyButton = true;
  callpage.value.devicesButton = true;
}

const switchMode = document.querySelector("button.mode-switch"),
  body = document.querySelector("body"),
  messageContainer = document.getElementById("message__container");

function switchmode() {
  body.classList.toggle("dark");
  callpage.value.switchMode = !callpage.value.switchMode;
}
function setMembersIsExpand() {
  callpage.value.expandMembers = !callpage.value.expandMembers;
  callpage.value.collapseMembers = !callpage.value.collapseMembers;
  if (callpage.value.expandMembers) {
    members__container.className = "collapseMembers";
    messages__container.className = "expandChatFull";
    if (!callpage.value.collapseChat) {
      callpage.value.expandChat = !callpage.value.expandChat;
      callpage.value.collapseChat = !callpage.value.collapseChat;
    }
  } else {
    members__container.className = "expandMembers";
    messages__container.className = "expandChat";
    if (callpage.value.collapseChat) {
      messages__container.className = "expandChat";
    }
  }
}
function setChatIsExpand() {
  callpage.value.expandChat = !callpage.value.expandChat;
  callpage.value.collapseChat = !callpage.value.collapseChat;
  if (callpage.value.expandChat) {
    messages__container.className = "collapseChat";
    members__container.className = "expandMembersFull";
    if (!callpage.value.collapseMembers) {
      callpage.value.expandMembers = !callpage.value.expandMembers;
      callpage.value.collapseMembers = !callpage.value.collapseMembers;
    }
  } else {
    messages__container.className = "expandChat";
    members__container.className = "expandMembers";
    if (callpage.value.collapseMembers) {
      members__container.className = "expandMembers";
    }
  }
}

function exitButton() {
  router
    .push({
      name: "home",
    })
    .catch((err) => {
      throw new Error(`Problem handling something: ${err}.`);
    });
}
</script>

<template>
  <main class="container">
    <button class="mode-switch" @click="switchmode()">
      <!-- sun icon -->
      <svg
        class="sun"
        fill="none"
        stroke="#fbb046"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <defs />
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        />
      </svg>
      <!-- sun icon -->

      <!-- moon icon -->
      <svg
        class="moon"
        fill="none"
        stroke="#ffffff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <defs />
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
      <!-- moon icon -->
    </button>
    <div id="room__container">
      <section id="stream__container">
        <div id="stream__box"></div>

        <div id="streams__container">
          <!-- <div class="video__container" id="user-container-1">
            <div class="video-player" id="user-1"></div>
          </div>
          <div class="video__container" id="user-container-2">
            <div class="video-player" id="user-2"></div>
          </div>
          <div class="video__container" id="user-container-3">
            <div class="video-player" id="user-3"></div>
          </div> -->
        </div>

        <FooterComponent
          @startAudio="roomRtc.setToggleMic()"
          @stopAudio="roomRtc.setToggleMic()"
          @startVideo="roomRtc.setToggleCamera()"
          @stopVideo="roomRtc.setToggleCamera()"
          @startScreen="roomRtc.setToggleScreen()"
          @stopScreen="roomRtc.setToggleScreen()"
          @exitButton="roomRtc.setLeaveStream()"
        />
      </section>

      <div class="right-side" v-show="callpage.rightSideIsOpened">
        <section id="members__container" class="expandMembers">
          <div id="members__header">
            <div class="participant">
              <p>Participants</p>
              <strong id="members__count">0</strong>
            </div>
            <div
              class="button__members expandCollapse"
              @click="setMembersIsExpand()"
            >
              <div class="expand__members" v-show="callpage.expandMembers">
                <font-awesome-icon icon="fa-solid fa-chevron-down" />
              </div>
              <div class="collapse__members" v-show="callpage.collapseMembers">
                <font-awesome-icon icon="fa-solid fa-chevron-up" />
              </div>
            </div>
          </div>

          <div id="members__list" v-show="callpage.collapseMembers"></div>
        </section>
        <section id="messages__container" class="expandChat">
          <div class="chat-header">
            <button class="chat-header-button">Live Chat</button>
            <div class="button__chat expandCollapse" @click="setChatIsExpand()">
              <font-awesome-icon
                icon="fa-solid fa-chevron-down"
                v-show="callpage.expandChat"
              />
              <font-awesome-icon
                icon="fa-solid fa-chevron-up"
                v-show="callpage.collapseChat"
              />
            </div>
          </div>
          <div id="messages" v-show="callpage.collapseChat"></div>

          <form id="message__form">
            <input
              type="text"
              name="message"
              placeholder="Send a message...."
            />
          </form>
        </section>
      </div>
    </div>
    <div class="message-button">
      <div class="icon-block" @click="callpage.setMessengerIsOpened">
        <font-awesome-icon icon="fa-regular fa-message" class="icon" />
      </div>
    </div>
  </main>
</template>

<style>
body {
  background-color: var(--app-background);
  font-family: "DM Sans", sans-serif;
  transition: 0.2s;
}
.container {
  background-color: var(--app-background);
  height: 100vh;
  width: 100%;
  position: relative;
}
.message-button {
  z-index: 1;
  position: absolute;
  top: 20px;
  right: 24px;
  background-color: var(--chat-background);
  border: none;
  color: #ddd;
  outline: none;
  cursor: pointer;
  box-shadow: var(--navigation-box-shadow);
  border-radius: 10px;
  display: none;
  width: 36px;
  height: 36px;
  padding-top: 4px;
  transform-origin: center;
}
.message-button svg {
  height: 24px;
  transform-origin: center;
}
.mode-switch {
  z-index: 1;
  position: absolute;
  top: 20px;
  left: 24px;
  background-color: var(--chat-background);
  border: none;
  color: #ddd;
  outline: none;
  cursor: pointer;
  box-shadow: var(--navigation-box-shadow);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  transform-origin: center;
}
.mode-switch svg {
  width: 0;
  height: 24px;
  transition: all 0.3s ease-in;
  transform-origin: center;
}
.mode-switch .moon {
  opacity: 0;
}
.mode-switch .sun {
  width: 24px;
}
.dark .moon {
  opacity: 1;
  width: 24px;
}
.dark .sun {
  opacity: 0;
  width: 0;
}

#room__container {
  position: relative;
  display: flex;
  gap: 3rem;
  width: 100%;
}

.expandMembers {
  height: 48vh;
}

.expandMembersFull {
  height: 87.1vh;
}

.collapseMembers {
  height: fit-content;
}

.collapseMembers #members__header {
  border: none;
}

.collapseMembers .members__list {
  display: none;
}

.expandChat {
  height: 48vh;
}
.expandChatFull {
  height: 87.1vh;
}

.collapseChat {
  height: fit-content;
}

.collapseChat .chat-header {
  border: none;
}

.collapseChat #messages {
  display: none;
}

.collapseChat #message__form {
  display: none;
}

#members__container {
  background-color: var(--chat-background);
  border-right: 1px solid #797a79;
  overflow-y: auto;
  width: 100%;
  max-width: 25rem;
  border-radius: 10px;
  border: 1px solid var(--border-bg);
  margin-top: 0.4rem;
}

#members__count {
  background-color: var(--message-text);
  padding: 7px 15px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 5px;
  color: var(--message-bg);
}

#members__header {
  display: flex;
  justify-content: space-between;
  border-radius: 10px 10px 0 0;
  align-items: center;
  padding: 0 1rem;
  font-size: 18px;
  background-color: var(--chat-background);
  max-width: 25rem;
  border-bottom: 1px solid var(--border-bg);
  color: var(--message-text);
}

.participant {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

#members__list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem;
}

.members__list::-webkit-scrollbar {
  height: 14px;
}

.member__wrapper {
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding-left: 1em;
  border-radius: 10px;
  border: 1px solid var(--border-bg);
  height: 2.5rem;
}

.green__icon {
  display: block;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #2aca3e;
}

.member_name {
  font-size: 14px;
  line-height: 0;
  color: var(--message-text);
}

.right-side {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 0.6rem);
  /* border-radius: 10px; */
  background-color: var(--chat-background);
  right: 0;
  /* margin: 0.5rem; */
  position: absolute;
  width: 100%;
  max-width: 25rem;
  padding: 0.3rem;
  gap: 0.5rem;
}

#messages__container {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid var(--border-bg);
}

.expandCollapse {
  cursor: pointer;
}

.chat-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-bg);
  color: var(--message-text);
}
.chat-header-button {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg' fill='%23fff'%3E%3Cpath d='M479.9 187.52l-90.19 68.53v-52.6a20 20 0 00-20-20H20a20 20 0 00-20 20V492a20 20 0 0020 20h349.71a20 20 0 0020-20v-52.6l90.18 68.52c13.05 9.91 32.1.67 32.1-15.92V203.45c0-16.5-18.94-25.92-32.1-15.93zM349.7 472H40V223.45h309.71zM472 451.68l-82.29-62.53V306.3L472 243.77zM87.96 79.24C129.62 28.88 190.86 0 256 0c65.13 0 126.37 28.88 168.03 79.24a20 20 0 01-30.82 25.5A177.6 177.6 0 00256 40a177.6 177.6 0 00-137.21 64.73 20 20 0 11-30.83-25.5zm240.36 32.21a20 20 0 11-21.02 34.03 97.57 97.57 0 00-51.3-14.53 97.6 97.6 0 00-51.31 14.53 20 20 0 11-21.02-34.03A137.53 137.53 0 01256 90.95c25.59 0 50.6 7.09 72.32 20.5zm0 0'/%3E%3C/svg%3E%0A");
  background-color: var(--main-color);
  padding: 12px 16px 12px 40px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-repeat: no-repeat;
  background-position: center left 12px;
  background-size: 16px;
  font-size: 14px;
}

#messages {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.message__wrapper:last-child {
  margin-bottom: 6.5rem;
}

.message__wrapper {
  display: flex;
  gap: 10px;
  margin: 1em;
}

.message__body {
  background-color: var(--message-bg);
  border-radius: 10px;
  padding: 10px 15px;
  width: fit-content;
  max-width: 900px;
}

.message__body strong {
  font-weight: 600;
  color: #ede0e0;
}

.message__body__bot {
  padding: 0 20px;
  max-width: 900px;
  color: #706a6a;
}

.message__author {
  margin-right: 10px;
  color: #2aca3e !important;
}

.message__author__bot {
  margin-right: 10px;
  color: #a52aca !important;
}

.message__text {
  margin: 0;
  color: var(--message-text);
}

#message__form {
  width: 100%;
  display: block;
  padding: 1em;
  box-sizing: border-box;
}

#message__form input {
  color: var(--message-text);
  width: 100%;
  border: none;
  border-radius: 5px;
  padding: 18px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: var(--message-bg);
}

#message__form input:focus {
  outline: none;
}

#message__form input::placeholder {
  color: var(--placeholder-text);
}

#stream__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 27rem);
  position: fixed;
  overflow-y: auto;
  height: calc(100vh - 7rem);
  border: 1px solid var(--border-bg);
  margin: 0.8rem 0 0 0.5rem;
  border-radius: 10px;
}

#stream__box {
  border-radius: 10px;
  height: 60vh;
  width: 63vw;
  display: none;
}

#stream__box .video__container {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--border-bg);
  border-radius: 10px;
  cursor: pointer;
  height: 100% !important;
  width: 100% !important;
}

#stream__box video {
  border-radius: 0;
}

#streams__container {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 25px;
}

.video__container {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--border-bg);
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  height: 250px;
  width: 300px;
  background-image: url("../assets/circle-user-solid.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 75px;
  background-color: #3f434a;
  position: relative;
}

.video__container svg {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: var(--button-bg);
  border: none;
}

.video__container .svg {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
  width: 20px;
  background-color: rgba(0, 15, 47, 0.5);
  background-repeat: no-repeat;
  background-position: center;
}

.hide {
  display: none;
}

.video-player {
  height: 100%;
  width: 100%;
}

.video-player video {
  border-radius: 10px;
}

@media (max-width: 1520px) {
  #stream__box {
    width: 60vw;
  }
}

@media (max-width: 1400px) {
  #stream__box {
    height: calc(55vw / 1.8);
    width: 55vw;
  }
  .video__container {
    height: 250px;
    width: 300px;
  }
}

@media (max-width: 1200px) {
  #stream__box {
    height: calc(50vw / 1.8);
    width: 50vw;
  }
  #stream__container {
    width: calc(100% - 25rem);
    left: 0;
  }
}

@media (max-width: 980px) {
  #stream__container {
    width: calc(100% - 20rem);
    left: 0;
  }
  .footer-item {
    width: calc(100% - 20rem);
  }

  .right-side {
    max-width: 20rem;
  }

  #members__container {
    max-width: 20rem;
  }

  #members__button {
    display: block;
  }

  #messages__container {
    max-width: 20rem;
  }
}

@media (max-width: 768px) {
  #stream__box {
    height: calc(90vw / 1.8);
    width: 90vw;
  }

  #stream__container {
    width: 100%;
  }

  .footer-item {
    width: 100vw;
  }

  .right-side {
    display: flex;
    flex-direction: column;
    height: 75vh;
    border-radius: 10px;
    background-color: var(--chat-background);
    margin: 0.5rem;
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: 80vw;
    padding: 0.3rem;
    gap: 0.2rem;
  }

  #members__container {
    display: none;
    max-width: 80vw;
  }

  #messages__container {
    max-width: 80vw;
    height: 100%;
    font-size: 1.5vw;
  }

  .chat-header {
    padding: 10px;
  }

  .chat-header-button {
    font-size: 12px;
  }

  #message__form {
    width: 100%;
  }

  .button__chat {
    display: none;
  }

  .message-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 624px) {
  #messages__container {
    font-size: 2vw;
  }
}

@media (max-width: 375px) {
  #messages__container {
    font-size: 2.5vw;
  }
}

@media (max-height: 650px) and (max-width: 768px) {
  .right-side {
    height: 70vh;
  }
  #message__form input {
    height: 2rem;
  }
}

@media (max-height: 500px) and (max-width: 768px) {
  .right-side {
    height: 60vh;
  }
  #message__form input {
    height: 2rem;
  }
}

@media (max-height: 350px) and (max-width: 768px) {
  .right-side {
    height: 50vh;
  }
  .chat-header {
    display: none;
  }

  #messages__container {
    max-width: 80vw;
    height: 100%;
    font-size: 1.5vw;
  }

  .chat-header-button {
    font-size: 12px;
  }

  #message__form input {
    height: 1.5rem;
  }
}
@media (max-height: 280px) and (max-width: 768px) {
  .right-side {
    height: 45vh;
  }
  .chat-header {
    display: none;
  }

  .chat-header-button {
    font-size: 8px;
  }

  #message__form input {
    height: 1rem;
    font-size: 8px;
  }
}
</style>
