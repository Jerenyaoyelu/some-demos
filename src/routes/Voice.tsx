import React, { useEffect } from "react";
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AudioContextProvider, useAgoraAudio, joinCall, leaveCall } from '../AgoraAudioContext';

const Home: React.FC = () => {
  const myAgora = useAgoraAudio();

  myAgora.registerClientListeners('user-published', async (user, mediaType) => {
    await myAgora.client?.subscribe(user, mediaType);
    console.log('连接成功', user);
    if (mediaType === 'audio') {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack?.play();
    }
  })

  myAgora.init();

  useEffect(() => {
    AgoraRTC.onMicrophoneChanged = (info) => {
      const isPlaying = myAgora.localAudioTrack?.isPlaying;
      if (!isPlaying) {
        console.log('暂无在活音频轨道');
        return;
      }
      console.log('麦克风设备变化===>', info);
      if (info.state === 'ACTIVE') {
        myAgora.localAudioTrack?.setDevice(info.device.deviceId).then(() => {
          console.log('麦克风设置成功===>')
        }).catch((err) => {
          console.log('麦克风设置失败===>', err)
        })
      } else {
        myAgora.useMicrophone();
      }
    }

    AgoraRTC.onPlaybackDeviceChanged = (info) => {
      const isPlaying = myAgora.localAudioTrack?.isPlaying;
      if (!isPlaying) {
        console.log('暂无在活音频轨道');
        return;
      }
      console.log('扬声器设备变化===>', info);
      AgoraRTC.getPlaybackDevices().then((speakers) => {
        console.log('扬声器列表', speakers);
      })
    }
  }, [])

  const setSpeaker = () => {
    AgoraRTC.getPlaybackDevices().then((speakers) => {
      console.log('扬声器列表', speakers);
      if (speakers.length) {
        console.log('扬声器设置中===>');
        const sp = speakers.find((item) => item.label.includes('扬声器'));
        if (!sp) {
          console.log('暂未检测到扬声器设备');
          return;
        }
        myAgora.openSpeaker(sp.deviceId);
      }
    })
  }


  return (
    <AudioContextProvider>
      <button onClick={joinCall}>加入语音</button>
      <button onClick={leaveCall}>离开语音</button>
      <br />
      <br />
      <button onClick={setSpeaker}>扬声器</button>
      <button onClick={myAgora.closeSpeaker}>关闭扬声器</button>
      <br />
      <br />
      <button onClick={myAgora.useMicrophone}>麦克风</button>
      <br />
      <br />
      <button onClick={myAgora.mute}>静音</button>
    </AudioContextProvider>
  )
}

export default Home;