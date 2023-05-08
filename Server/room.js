export default class room {
  constructor(stream__box, streams__container) {
    let displayFrame = stream__box;
    this.displayFrame = displayFrame
    let videoFrames = document.getElementsByClassName('video__container');
    this.videoFrames = videoFrames
    let userIdInDisplayFrame = null;
    this.userIdInDisplayFrame = userIdInDisplayFrame

    let expandVideoFrame = (e) => {
      let child = displayFrame.children[0];
      if (child) {
        streams__container.appendChild(child);
      }

      displayFrame.style.display = "block";
      displayFrame.appendChild(e.currentTarget);
      userIdInDisplayFrame = e.currentTarget.id;

      console.log(userIdInDisplayFrame)

      for (let i = 0; videoFrames.length > i; i++) {
        if (videoFrames[i].id != userIdInDisplayFrame) {
          videoFrames[i].style.height = "100px";
          videoFrames[i].style.width = "150px";
        }
      }
    };

    this.expandVideoFrame = expandVideoFrame

    for (let i = 0; videoFrames.length > i; i++) {
      videoFrames[i].addEventListener("click", expandVideoFrame);
    }

    let hideDisplayFrame = () => {
      userIdInDisplayFrame = null;
      displayFrame.style.display = null;

      let child = displayFrame.children[0];
      document.getElementById("streams__container").appendChild(child);

      for (let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.height = "250px";
        videoFrames[i].style.width = "300px";
      }
    };
    this.hideDisplayFrame = hideDisplayFrame

    displayFrame.addEventListener("click", hideDisplayFrame);
  }

}
