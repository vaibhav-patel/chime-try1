import {
  useContentShareState,
  LocalVideo,
  useLocalVideo,
  useRemoteVideoTileState,
  RemoteVideo,
  ContentShare,
  useContentShareControls,
  useFeaturedTileState,
  useSelectVideoQuality,
  useRosterState,
  Roster,
  RosterGroup,
  RosterAttendee,
  useAttendeeStatus
} from "amazon-chime-sdk-component-library-react";

const Chime = ({ videoTiles }) => {
  const { toggleVideo } = useLocalVideo();
  const { toggleContentShare } = useContentShareControls();
  const { tileId } = useFeaturedTileState();
  const {
    tiles,
    attendeeIdToTileId,
    tileIdToAttendeeId
  } = useRemoteVideoTileState();
  const { isLocalUserSharing } = useContentShareState();
  const selectVideoQuality = useSelectVideoQuality();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);

  const localVid = document.getElementById("localvideo");
  const remoteVid = document.getElementById(`remote_${tileId}`);
  if (localVid) {
    if (tileId === null) {
      console.log("local tile null");

      localVid.classList.add("localvideo_main");
      localVid.classList.remove("localvideo_side");
    } else {
      console.log("local tile else");

      localVid.classList.add("localvideo_side");
      localVid.classList.remove("localvideo_main");
    }
  }
  if (remoteVid) {
    if (tileId === null) {
      console.log("remote tile null");
      remoteVid.classList.add("remotevideo");
      remoteVid.classList.remove("ch-featured-tile");
    } else {
      console.log("remote tile else");

      remoteVid.classList.remove("remotevideo");
      remoteVid.classList.add("ch-featured-tile");
    }
  }

  const buttonClick = () => {
    console.log("button");
    toggleVideo();
    selectVideoQuality("360p");
  };
  const remoteTiles = Object.entries(attendeeIdToTileId).map((e) => ({
    [e[0]]: e[1]
  }));

  const attendeeItems = attendees.map((attendee) => {
    const { chimeAttendeeId, externalUserId } = attendee;
    const name = externalUserId.split("#")[1];
    console.log("attendee", attendee, name);
    remoteTiles.length > 0 &&
      remoteTiles.map((r) => {
        if (r[chimeAttendeeId]) {
          console.log("remote name", r[chimeAttendeeId], name);
        }
      });
    return (
      <MyRosterCell
        key={chimeAttendeeId}
        attendeeId={chimeAttendeeId}
        name={name}
      />
    );
  });
  return (
    <>
      {videoTiles && (
        <>
          <button onClick={buttonClick}>Toggle video</button>
          <button onClick={toggleContentShare}>ScreenShare</button>
          {tileId && <p>Active Id now: {tileId}</p>}
          <div
            style={{
              padding: "1rem",
              width: "830px",
              height: "480px"
            }}
          >
            {videoTiles && <LocalVideo nameplate="me" id="localvideo" />}
            {/* <VideoTileGrid layout="featured"> */}
            {tiles.map((item) => {
              const attendee = tileIdToAttendeeId[item];
              let remotename = "";
              if (roster[attendee]) {
                const { externalUserId } = roster[attendee];
                remotename = externalUserId.split("#")[1];
              }
              return (
                <>
                  <RemoteVideo
                    tileId={item}
                    id={`remote_${item}`}
                    className="remotevideo"
                  />
                  <span>user: {remotename}</span>
                </>
              );
            })}

            <ContentShare />
            {/* {attendeeItems} */}
            {/* <RemoteVideos /> */}
          </div>
        </>
      )}
    </>
  );
};

const MyRosterCell = ({ name, attendeeId }) => {
  const { videoEnabled, sharingContent, muted } = useAttendeeStatus(attendeeId);

  return (
    <div>
      <div>{name}</div>
      {muted ? <span>muted</span> : <span>unmuted</span>}
      {/* {sharingContent ? <MyIcon> : <MyDisabledIcon />} */}
      {videoEnabled ? <span>camera on</span> : <span>camera off</span>}
    </div>
  );
};

export default Chime;
