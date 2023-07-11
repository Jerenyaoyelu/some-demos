import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  SDK_CODEC,
  SDK_MODE,
} from 'agora-rtc-sdk-ng';

type AgoraClientListenerCbType = (
  user: IAgoraRTCRemoteUser,
  mediaType: 'audio' | 'video'
) => Promise<any>;

interface IMyAgoraRTC {
  client: IAgoraRTCClient | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  init: (mode?: SDK_MODE, codec?: SDK_CODEC) => Promise<any>;
  join: (opts: IOption) => Promise<any>;
  leave: () => Promise<any>;
  registerClientListeners: (
    eventType: string,
    cb: AgoraClientListenerCbType
  ) => void; //监听AgoraRTC语音对象创建成功
}

export interface IOption {
  appId: string;
  channel: string;
  token: string;
  uid: string | number;
}

class MyAgoraRTCAudio implements IMyAgoraRTC {
  private _client: IAgoraRTCClient | null;
  private _localAudioTrack: IMicrophoneAudioTrack | null;
  private _listeners: { event: string; cb: AgoraClientListenerCbType }[];

  constructor() {
    this._client = null;
    this._localAudioTrack = null;
    this._listeners = [];
  }

  // 创建语音对象，并执行监听事件的注册逻辑
  async init(mode: SDK_MODE = 'rtc', codec: SDK_CODEC = 'vp8') {
    console.log('===开始创建语音对象===');
    this._client = AgoraRTC.createClient({
      mode,
      codec,
    });
    console.log('===语音对象创建成功===');
    if (this._listeners.length) {
      console.log('===开始注册监听事件===');
      this._listeners.forEach((item) => {
        this._client?.on(item.event, item.cb);
      });
      console.log('===监听事件注册完成===');
    }
  }

  // 创建语音对象之前注册语音对象的监听事件
  registerClientListeners(eventType: string, cb: AgoraClientListenerCbType) {
    this._listeners.push({
      event: eventType,
      cb,
    });
  }

  async leave() {
    console.log('===准备离开语音频道===');
    this._localAudioTrack?.close();
    await this._client?.leave();
    console.log('===语音频道离开成功===');
  }

  async join(opts: IOption) {
    console.log('===开始加入语音频道===');
    await this._client?.join(opts.appId, opts.channel, opts.token, opts.uid);
    this._localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await this._client?.publish([this._localAudioTrack]);
    console.log('===语音频道加入成功===');
  }

  get client() {
    return this._client;
  }

  get localAudioTrack() {
    return this._localAudioTrack;
  }

  mute() {
    this._localAudioTrack?.setMuted(true);
    console.log('===静音已开启===');
  }

  unmute() {
    this._localAudioTrack?.setMuted(false);
    console.log('===静音已关闭===');
  }

  // setDevice('')会报错
  useMicrophone() {
    AgoraRTC.getMicrophones().then((microphones) => {
      console.log('===麦克风列表===', microphones);
      if (microphones.length) {
        console.log('===麦克风设置中===');
        this._localAudioTrack
          ?.setDevice(microphones[0].deviceId)
          .then(() => {
            console.log('===麦克风设置成功===');
          })
          .catch((err) => {
            console.log('===麦克风设置失败===', err);
          });
      }
    });
  }

  openSpeaker(deviceId: string) {
    const remoteUser = this._getRemoteUsers();
    if (!remoteUser) return;
    remoteUser[0].audioTrack
      ?.setPlaybackDevice(deviceId)
      .then(() => {
        console.log('===扬声器设置成功===');
      })
      .catch((err) => {
        console.log('===扬声器设置失败===', err);
      });
  }

  closeSpeaker() {
    const remoteUser = this._getRemoteUsers();
    if (!remoteUser) return;
    remoteUser[0].audioTrack
      ?.setPlaybackDevice('')
      .then(() => {
        console.log('===扬声器关闭成功===');
      })
      .catch((err) => {
        console.log('===扬声器关闭失败===', err);
      });
  }

  private _getRemoteUsers() {
    const remoteUser = this._client?.remoteUsers;
    if (!remoteUser) {
      console.log('未采集到远端语音轨道，暂时无法操作扬声器');
      return;
    }

    if (!remoteUser.length) {
      console.log('您当前未加入任何语音频道，请先加入');
      return;
    }
    return remoteUser;
  }
}

export default MyAgoraRTCAudio;
