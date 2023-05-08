import { ref } from "vue";

export const callpage = ref({
  meetingDetailsIsOpened: false,
  messengerIsOpened: false,
  membersListIsOpened: false,
  switchMode: false,
  isScreenSharing: false,
  rightSideIsOpened: true,
  startAudioButton: false,
  stopAudioButton: false,
  startVideoButton: false,
  stopVideoButton: false,
  startScreenButton: false,
  stopScreenButton: false,
  exitButton: true,
  copyButton: false,
  devicesButton: false,
  usersList: [],
  messages: [],
  message: {},
  username: "",
  expandMembers: false,
  collapseMembers: true,
  expandChat: false,
  collapseChat: true,
  setMeetingDetailsIsOpened() {
    this.meetingDetailsIsOpened = !this.meetingDetailsIsOpened;
  },
  setMessengerIsOpened() {
    this.messengerIsOpened = !this.messengerIsOpened;
    this.rightSideIsOpened = !this.rightSideIsOpened;
  },
  setMembersListIsOpened() {
    this.membersListIsOpened = !this.membersListIsOpened;
    this.rightSideIsOpened = !this.rightSideIsOpened;
  }
});

export default callpage;
