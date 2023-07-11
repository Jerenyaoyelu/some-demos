import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from 'agora-rtc-sdk-ng';

interface RtcType {
  client: IAgoraRTCClient | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
}

export const rtc: RtcType = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

const options = {
  appId: '9aef10b7cf2f41ea975558459692f900',
  channel: 'testroom',
  token:
    '007eJxTYPh2wqd4/r95b6/P69WOfqL0sD5tCmfpAu1yJqFVK9vffzFSYLBMTE0zNEgyT04zSjMxTE20NDc1NbUwMbU0szRKszQwuH7LI7khkJFh7/GDLIwMEAjiczCUpBaXFOXn5zIwAACaCyPX',
  uid: null,
  certificate: '3c612005d6cc4b42a7f2fc762efa29e8',
  rtmToken:
    '0069aef10b7cf2f41ea975558459692f900IAC64Z7RVodl6nBDG7nTO3iFcM+wLcu5FZjO++s+b4G+kLfv3IMAAAAAEADRTg9MKuZEYwEA6AMq5kRj',
};

export const startBasicCall = async () => {
  rtc.client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });
  rtc.client.on('user-published', async (user, mediaType) => {
    await rtc.client?.subscribe(user, mediaType);
    console.log('连接成功', user);

    if (mediaType === 'video') {
      const remoteVideoTrack = user.videoTrack;
      const remotePlayerContainer = document.createElement('div');
      // Specify the ID of the DIV container. You can use the uid of the remote user.
      remotePlayerContainer.id = user.uid.toString();
      remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString();
      remotePlayerContainer.style.width = '640px';
      remotePlayerContainer.style.height = '480px';
      document.body.append(remotePlayerContainer);

      // Play the remote video track.
      // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
      remoteVideoTrack?.play(remotePlayerContainer);
    }

    if (mediaType === 'audio') {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack?.play();
    }
  });
  rtc.client.on('user-unpublished', (user) => {
    // Unsubscribe from the tracks of the remote user.
    // Get the dynamically created DIV container.
    const remotePlayerContainer = document.getElementById(user.uid.toString());
    // Destroy the container.
    remotePlayerContainer?.remove();
  });
};

export const joinVideoCall = async () => {
  // Join an RTC channel.
  await rtc.client?.join(
    options.appId,
    options.channel,
    options.token,
    options.uid
  );
  // Create a local audio track from the audio sampled by a microphone.
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Create a local video track from the video captured by a camera.
  rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  // Publish the local audio and video tracks to the RTC channel.
  await rtc.client?.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
  // Dynamically create a container in the form of a DIV element for playing the local video track.
  const localPlayerContainer = document.createElement('div');
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = options.uid + '';
  localPlayerContainer.textContent = 'Local user ' + options.uid;
  localPlayerContainer.style.width = '640px';
  localPlayerContainer.style.height = '480px';
  document.body.append(localPlayerContainer);
  // Play the local video track.
  // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
  rtc.localVideoTrack.play(localPlayerContainer);
  console.log('publish success!');
};

export const joinVoiceCall = async () => {
  // Join an RTC channel.
  await rtc.client?.join(
    options.appId,
    options.channel,
    options.token,
    options.uid
  );
  // Create a local audio track from the audio sampled by a microphone.
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Publish the local audio tracks to the RTC channel.
  await rtc.client?.publish([rtc.localAudioTrack]);

  console.log('publish success!');
};

export const leaveVideoCall = async () => {
  // Destroy the local audio track.
  rtc.localAudioTrack?.close();
  rtc.localVideoTrack?.close();

  // Traverse all remote users.
  rtc.client?.remoteUsers.forEach((user) => {
    // Destroy the dynamically created DIV containers.
    const playerContainer = document.getElementById(user.uid.toString());
    playerContainer && playerContainer.remove();
  });

  // Leave the channel.
  await rtc.client?.leave();
};

export const leaveVoiceCall = async () => {
  // Destroy the local audio track.
  rtc.localAudioTrack?.close();

  // Leave the channel.
  await rtc.client?.leave();
};
