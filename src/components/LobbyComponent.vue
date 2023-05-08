<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const body = document.querySelector("body");

export default {
  name: "LobbyPage",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      nameInput: "user_" + Math.round(Math.random() * 1000),
      roomIdInput: "123",
    };
  },
  methods: {
    joinRoom() {
      this.$router
        .push({
          name: "room",
          params: {
            nameInput: this.$data.nameInput,
            roomIdInput: this.$data.roomIdInput,
          },
        })
        .catch((err) => {
          throw new Error(`Problem handling something: ${err}.`);
        });
    },
    switchmode() {
      body.classList.toggle("dark");
      callpage.value.switchMode = !callpage.value.switchMode;
    },
  },
};
</script>

<template>
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
  <main id="room__lobby__container">
    <div id="form__container">
      <div id="form__container__header">
        <p>Create or Join Room</p>
      </div>

      <form id="lobby__form">
        <div class="form__field__wrapper">
          <label>Your Name</label>
          <input
            v-model="nameInput"
            type="text"
            name="name"
            required
            placeholder="Enter your display name..."
          />
        </div>

        <div class="form__field__wrapper">
          <label>Room Name</label>
          <input
            v-model="roomIdInput"
            type="text"
            name="room"
            required
            placeholder="Enter room name..."
          />
        </div>

        <div class="form__field__wrapper">
          <button type="submit" @click="joinRoom">
            Go to Room
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style>
#form__container {
  width: 90%;
  max-width: 600px;
  border-radius: 10px;
  background-color: var(--form-bg);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#lobby__form {
  padding: 2em;
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

#form__container__header {
  border-radius: 10px 10px 0 0;
  padding: 10px;
  text-align: center;
  background-color: var(--form-header);
  color: #fff;
  margin: 0;
  font-size: 18px;
  font-size: 300;
  line-height: 0;
}

.form__field__wrapper {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.form__field__wrapper label {
  font-size: 14px;
  line-height: 1.7em;
  margin-bottom: 10px;
  display: block;
  color: var(--message-text);
}

.form__field__wrapper input {
  box-sizing: border-box;
  color: var(--message-text);
  width: 100%;
  margin: 0;
  border: none;
  border-radius: 5px;
  padding: 16px 20px;
  font-size: 15px;
  background-color: var(--form-input);
}

.form__field__wrapper button[type="submit"] {
  margin-top: 32px;
  cursor: pointer;
  background-color: #845695;
  border: none;
  color: #fff;
  font-size: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 5px;
  gap: 10px;
}

.form__field__wrapper button[type="submit"] svg {
  fill: #ede0e0;
  width: 20px;
}

#avatar__selection {
  margin-right: 10px;
  display: flex;
  gap: 1em;
}

.avatar__option {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
  border: 2px solid #797a79;
}

.avatar__option__selected {
  border: 3px solid #845695;
}
</style>
