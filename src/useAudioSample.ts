/**
 * @file 声音的采样功能
 * @author Yangholmes 2024-08-13
 */

import {ref} from 'vue';

export function useAudioSample() {
  // const isInited = ref<boolean>(false)

  const audioCtxRef = ref<AudioContext>();
  const analyserRef = ref<AnalyserNode>();

  async function getAudioCtx() {
    // return new Promise((resolve, reject) => {})

    if (audioCtxRef.value && analyserRef.value) {
      return {
        audioCtx: audioCtxRef.value,
        analyser: analyserRef.value
      };
    }

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    // analyser.minDecibels = -90;
    // analyser.maxDecibels = -10;
    // analyser.smoothingTimeConstant = 0.85;
    // 傅里叶变换窗口
    analyser.fftSize = 16384;

    const constraints = { audio: true };

    return navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log(stream);
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        // 声音连接声卡，由声卡输出 mic 收集到的声音
        // analyser.connect(audioCtx.destination);

        audioCtxRef.value = audioCtx;
        analyserRef.value = analyser;

        return {
          audioCtx, analyser
        };
      }).catch(err => {
        clarity('event', 'permissionDenied');
        throw err;
      });
  }

  return {
    getAudioCtx,
  };
}
