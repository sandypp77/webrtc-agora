const APP_ID = "47a81b4d72f141c7a53ede700867a705";
import callpage from "../src/stores/callpage.js";
import room from "../Server/room.js";
import room_rtm from "../Server/room_rtm.js";
import { v4 } from "uuid";

export default class room_rtc {
  constructor(
    AgoraRTC,
    AgoraRTM,
    streams__container,
    stream__box,
    nameInput,
    roomIdInput,
    route,
    router
  ) {
    let uid = v4()
    if (!uid) {
      uid = String(Math.floor(Math.random() * 10000));
      sessionStorage.setItem("uid", uid);
    }
    console.log("uid", uid)

    let token = null;
    let client;
    let rtmClient;
    let channel;
    let roomClass = new room(stream__box, streams__container);

    let roomId = roomIdInput;
    if (!roomId) {
      roomId = "main";
    }

    let displayName = nameInput;
    let localTracks = [];
    let remoteUsers = {};

    let localScreenTracks;
    let roomRtm =null;

    let joinRoomInit = async () => {
      rtmClient = await AgoraRTM.createInstance(APP_ID);
      await rtmClient.login({ uid, token });
      await rtmClient.addOrUpdateLocalUserAttributes({ name: displayName });

      channel = await rtmClient.createChannel(roomId);
      await channel.join();

      roomRtm = new room_rtm(
        rtmClient,
        channel,
        displayName,
        uid,
        roomClass
      );

      channel.on("MemberJoined", roomRtm.handleMemberJoined);
      channel.on("MemberLeft", roomRtm.handleMemberLeft);
      channel.on("ChannelMessage", roomRtm.handleChannelMessage);

      roomRtm.getMembers();
      roomRtm.addBotMessageToDom(`Welcome to the room ${displayName}! 👋`);

      client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      await client.join(APP_ID, roomId, token, uid);
      client.on("user-published", handleUserPublished);
      client.on("user-left", handleUserLeft);
      joinStream();
    };

    let joinStream = async () => {
      localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        { encoderConfig: "high_quality_stereo" },
        {
          encoderConfig: {
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 },
          },
        }
      );
      let player = `<div class="video__container video-${uid}" id="user-container-${uid}">
                              <div class="video-player" id="user-${uid}"></div>
                              <div class="svg"><svg id="on-user-${uid}" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
                        <svg id="off-user-${uid}" class="hide" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z"/></svg>
                        </div>
                           </div>`;

      streams__container.insertAdjacentHTML("beforeend", player);
      document
        .getElementById(`user-container-${uid}`)
        .addEventListener("click", roomClass.expandVideoFrame);

      localTracks[1].play(`user-${uid}`);
      await client.publish([localTracks[0], localTracks[1]]);

      initVolumeIndicator();
    };

    let handleUserPublished = async (user, mediaType) => {
      remoteUsers[user.uid] = user;
      await client.subscribe(user, mediaType);
      let player = document.getElementById(`user-container-${user.uid}`);
      if (player === null) {
        player = `<div class="video__container video-${user.uid}" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div>
                        <div class="svg"><svg id="on-user-${user.uid}" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
                        <svg id="off-user-${user.uid}" class="hide" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z"/></svg>
                        </div>
                    </div>`;

        streams__container.insertAdjacentHTML("beforeend", player);
        document
          .getElementById(`user-container-${user.uid}`)
          .addEventListener("click", roomClass.expandVideoFrame);
      }

      if (mediaType === "video") {
        if (typeof user.videoTrack !== "undefined") {
          user.videoTrack.play(`user-${user.uid}`);
        }
      }

      if (mediaType === "audio") {
        user.audioTrack.play();
        initMuteIndicator();
      }
    };

    let handleUserLeft = async (user) => {
      delete remoteUsers[user.uid];
      let item = document.getElementById(`user-container-${user.uid}`);
      if (item) {
        item.remove();
      }
    };

    let initMuteIndicator = () => {
      client.on("user-info-updated", (uid, msg) => {
        console.log("Indicator", `UID ${uid} msg ${msg}`);
        if (msg === "mute-audio") {
          document
            .getElementById(`on-user-${uid}`)
            .setAttribute("class", "hide");
          document.getElementById(`off-user-${uid}`).classList.remove("hide");
        } else if (msg === "unmute-audio") {
          document.getElementById(`on-user-${uid}`).classList.remove("hide");
          document
            .getElementById(`off-user-${uid}`)
            .setAttribute("class", "hide");
        }
      });
    };

    let initVolumeIndicator = () => {
      AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
      client.enableAudioVolumeIndicator();

      client.on("volume-indicator", (volumes) => {
        // console.log("volumes:", volumes);
        volumes.forEach((volume) => {
          // console.log(`UID ${volume.uid} Level ${volume.level}`);

          try {
            let item = document.getElementsByClassName(
              `video-${volume.uid}`
            )[0];

            if (typeof item !== "undefined") {
              if (volume.level >= 50) {
                item.style.borderColor = "#2aca3e";
              } else {
                if (callpage.value.switchMode) {
                  item.style.borderColor = "#707575";
                } else {
                  item.style.borderColor = "#2c303a";
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        });
      });
    };

    let toggleMic = async (e) => {
      if (localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        document.getElementById(`on-user-${uid}`).classList.remove("hide");
        document
          .getElementById(`off-user-${uid}`)
          .setAttribute("class", "hide");
      } else {
        await localTracks[0].setMuted(true);
        document.getElementById(`on-user-${uid}`).setAttribute("class", "hide");
        document.getElementById(`off-user-${uid}`).classList.remove("hide");
      }
    };

    this.setToggleMic = toggleMic;

    let toggleCamera = async (e) => {
      if (localTracks[1].enabled) {
        await localTracks[1].setEnabled(false);
        document
          .getElementById(`user-${uid}`)
          .children[0].setAttribute("class", "hide");
      } else {
        await localTracks[1].setEnabled(true);
        document
          .getElementById(`user-${uid}`)
          .children[0].classList.remove("hide");
      }
    };

    this.setToggleCamera = toggleCamera;

    let toggleScreen = async (e) => {
      if (!callpage.value.isScreenSharing) {
        document
          .getElementById(`user-container-${uid}`)
          .addEventListener("click", roomClass.hideDisplayFrame);

        localScreenTracks = await AgoraRTC.createScreenVideoTrack();

        if (localScreenTracks) {
          callpage.value.isScreenSharing = true;
          callpage.value.startScreenButton = false;
          callpage.value.stopScreenButton = true;
        }

        document.getElementById(`user-container-${uid}`).remove();
        roomClass.displayFrame.style.display = "block";

        let player = `<div class="video__container video-${uid}" id="user-container-${uid}">
                  <div class="video-player" id="user-${uid}"></div>
              </div>`;

        roomClass.displayFrame.insertAdjacentHTML("beforeend", player);
        document
          .getElementById(`user-container-${uid}`)
          .addEventListener("click", roomClass.expandVideoFrame);

        let userIdInDisplayFrame = `user-container-${uid}`;
        localScreenTracks.play(`user-${uid}`);

        await localTracks[1].setEnabled(false);
        await client.unpublish([localTracks[1]]);
        await client.publish([localScreenTracks]);

        let videoFrames = document.getElementsByClassName("video__container");
        for (let i = 0; videoFrames.length > i; i++) {
          if (videoFrames[i].id != userIdInDisplayFrame) {
            videoFrames[i].style.height = "100px";
            videoFrames[i].style.width = "150px";
          }
        }

        localScreenTracks.on("track-ended", () => {
          stopSharing();
        });
      } else {
        stopSharing();
      }
    };

    let stopSharing = async () => {
      callpage.value.isScreenSharing = false;
      callpage.value.startScreenButton = true;
      callpage.value.stopScreenButton = false;
      document.getElementById(`user-container-${uid}`).remove();
      await client.unpublish([localScreenTracks]);

      switchToCamera();
    };

    this.setToggleScreen = toggleScreen;

    let switchToCamera = async () => {
      let player = `<div class="video__container video-${uid}" id="user-container-${uid}">
                      <div class="video-player" id="user-${uid}"></div>
                   </div>`;
      roomClass.displayFrame.insertAdjacentHTML("beforeend", player);

      await localTracks[1].setEnabled(true);

      localTracks[1].play(`user-${uid}`);
      await client.publish([localTracks[1]]);
    };

    let leaveStream = async () => {
      for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop();
        localTracks[i].close();
      }

      await client.unpublish([localTracks[0], localTracks[1]]);

      if (localScreenTracks) {
        await client.unpublish([localScreenTracks]);
      }

      document.getElementById(`user-container-${uid}`).remove();

      let userIdInDisplayFrame = `user-container-${uid}`;
      let videoFrames = document.getElementsByClassName("video__container");
      if (userIdInDisplayFrame === `user-container-${uid}`) {
        roomClass.displayFrame.style.display = null;

        for (let i = 0; videoFrames.length > i; i++) {
          videoFrames[i].style.height = "250px";
          videoFrames[i].style.width = "300px";
        }
      }

      channel.sendMessage({
        text: JSON.stringify({ type: "user_left", uid: uid }),
      });

      roomRtm.leaveChannel()

      backToHome()

      // setInterval(backToHome, 500);
    };

    this.setLeaveStream = leaveStream;

    let backToHome = () => {
      router.push({
        name: "home",
      });
    };

    if (!displayName) {
      router.push({
        name: "home",
      });
    } else {
      joinRoomInit();
    }
  }
}
