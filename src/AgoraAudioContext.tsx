import React, { ReactNode, useContext } from 'react';
import MyAgoraAudio, { IOption } from './agoraRtc';

const agora = new MyAgoraAudio();

const options: IOption = {
  appId: '9aef10b7cf2f41ea975558459692f900',
  channel: 'testroom',
  token:
    '007eJxTYAgouTbfLiZyrjfnrYSVPbtCHrQc68yI9Jldlsi3o/PNgg8KDJaJqWmGBknmyWlGaSaGqYmW5qamphYmppZmlkZplgYG9y3jkxsCGRn8GJcwMjJAIIjPwVCSWlxSlJ+fy8AAAADgIUc=',
  uid: '',
  // certificate: '3c612005d6cc4b42a7f2fc762efa29e8',
  // rtmToken:
  //   '0069aef10b7cf2f41ea975558459692f900IAC64Z7RVodl6nBDG7nTO3iFcM+wLcu5FZjO++s+b4G+kLfv3IMAAAAAEADRTg9MKuZEYwEA6AMq5kRj',
};

export async function joinCall() {
  await agora.join(options);
}

export async function leaveCall() {
  await agora.leave();
}

const AudioContext = React.createContext<MyAgoraAudio>(agora);

export const AudioContextProvider: React.FC<ProviderPropsType> = ({ children }) => {
  return (
    <AudioContext.Provider value={agora}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAgoraAudio() {
  return useContext(AudioContext);
}

type ProviderPropsType = {
  children?: ReactNode;
};
