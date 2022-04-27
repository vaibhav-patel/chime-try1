import "./styles.css";
import {
  useMeetingManager,
  useMeetingStatus,
  useToggleLocalMute,
  useSelectAudioInputDevice,
  useAudioInputs
} from "amazon-chime-sdk-component-library-react";
import Chime from "./Chime";
import { useState } from "react";

export default function App() {
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { muted, toggleMute } = useToggleLocalMute();
  const selectAudioInput = useSelectAudioInputDevice();
  const [audioStatus, setAudioStatus] = useState(false);
  const [videoTiles, setVideoTiles] = useState(false);
  const { devices, selectedDevice } = useAudioInputs();

  const url = `https://gvkbmker50.execute-api.us-east-1.amazonaws.com/dev/meet/join?title=test1&name=vaibhav2${Math.random()}&region=us-east-1`;
  const payload = {};

  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(payload) // body data type must match "Content-Type" header
    });
    const data = await response.json();

    console.log(`data`, data);
    const joinData = {
      meetingInfo: data.JoinInfo.Meeting,
      attendeeInfo: data.JoinInfo.Attendee
    };

    // Use the join API to create a meeting session
    await meetingManager.join(joinData);

    // At this point you can let users setup their devices, or start the session immediately
    await meetingManager.start();
    setVideoTiles(true);
    // toggleMute();
  };

  const handleAudio = () => {
    setAudioStatus(!audioStatus);
    if (!audioStatus) {
      console.log("input default");
      selectAudioInput("default");
    } else {
      console.log("input null");
      selectAudioInput(null);
    }
  };

  console.log("devices", devices, "selectedDevice", selectedDevice);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <p>Meeting Status: {meetingStatus}</p>
      <button onClick={handleAudio}>Mute/Unmute</button>
      <button onClick={joinMeeting}>Join</button>
      <Chime videoTiles={videoTiles} />
    </div>
  );
}
