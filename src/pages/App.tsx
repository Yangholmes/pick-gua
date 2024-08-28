/**
 * @file 频谱页
 * @author Yangholmes 2024-08-11
 */

import { computed, defineComponent, ref } from 'vue';
import cn from 'classnames';
import { useAudioSample } from '../useAudioSample';

import styles from './app.module.less';
import Watermelon, { Type } from '@/components/Watermelon';
import PerssionApply from '@/components/PerssionApply';

const MIN_FREQ = 133;
const MAX_FREQ = 160;

export default defineComponent({
  name: 'App',
  setup() {
    const {getAudioCtx} = useAudioSample();
    const audioCtxRef = ref<AudioContext>();
    const analyserRef = ref<AnalyserNode>();

    /** 画布引用 */
    const canvasRef = ref<HTMLCanvasElement>();

    const drawHisHanle = ref<number>();

    const maxVolFreq = ref<number>();

    const resule = computed<Type>(() => {
      if (maxVolFreq.value === undefined) {
        return Type.Null;
      }
      if (maxVolFreq.value < MIN_FREQ ) {
        return Type.Overripe;
      }
      if (maxVolFreq.value >= MIN_FREQ && maxVolFreq.value <= MAX_FREQ) {
        return Type.Good;
      }
      if (maxVolFreq.value > MAX_FREQ) {
        return Type.Raw;
      }
      return Type.Null;
    });

    function draw() {
      if (!audioCtxRef.value || !analyserRef.value) {
        throw new Error('未初始化');
      }

      const audioCtx = audioCtxRef.value;
      const analyser = analyserRef.value;
      /** 最大采样频率 */
      const freq = audioCtx.sampleRate / 2;
      console.log('最大采样频率: ', freq);

      /** 最大显示频率 */
      const maxFreq = 200;

      /** 最小显示频率 */
      const minFreq = 20;

      // 傅里叶变换窗口
      // analyser.fftSize = 16384;

      /** 数据长度 */
      const bufferLengthAlt = analyser.frequencyBinCount;
      console.log('数据长度: ', bufferLengthAlt);

      /** 频率精度 */
      const q = freq / bufferLengthAlt;

      /** 最大显示频率对应的索引 */
      const maxFreqStep = Math.floor(maxFreq / q);
      const minFreqStep = Math.floor(minFreq / q);

      console.log(maxFreqStep, minFreqStep);

      /** 申请频域数组内存块 */
      const dataArrayAlt = new Uint8Array(bufferLengthAlt);

      // 开始渲染直方图
      const ctx = canvasRef.value?.getContext('2d');
      const WIDTH = canvasRef.value?.width || 0;
      const HEIGHT = canvasRef.value?.height || 0;

      console.log(WIDTH, HEIGHT);

      function drawHis() {
        if (!ctx) {
          return;
        }
        drawHisHanle.value = requestAnimationFrame(drawHis);

        // 收集频域数组
        analyser.getByteFrequencyData(dataArrayAlt);

        // console.log(dataArrayAlt);

        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        /** 每个频率的宽度 */
        const barWidth = WIDTH / (maxFreqStep - minFreqStep);

        let x = 0;

        let maxVolFreqIndex = 0;
        let volTmp = 0;

        for (let i = minFreqStep; i < maxFreqStep; i++) {
          const barHeight = dataArrayAlt[i];

          if (volTmp < barHeight) {
            volTmp = barHeight;
            maxVolFreqIndex = i;
          }

          const cFreq = i * q;

          let color = `rgb(255, 201, 201)`;
          if (cFreq >= MIN_FREQ && cFreq <= MAX_FREQ) {
            color = `rgb(178, 242, 187)`;
          }

          ctx.fillStyle = color;
          ctx.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth;
        }

        maxVolFreq.value = maxVolFreqIndex * q;
      }

      drawHis();
    }

    const hasGranted = computed<boolean>(() => !!audioCtxRef.value && !!analyserRef.value);
    function init() {
      if (!audioCtxRef.value || !analyserRef.value) {
        getAudioCtx().then((res) => {
          const {audioCtx, analyser} = res;
          audioCtxRef.value = audioCtx;
          analyserRef.value = analyser;
          audioCtx.suspend();
        });
      }
    }

    function onStart() {
      if (!audioCtxRef.value || !analyserRef.value) {
        // getAudioCtx().then((res) => {
        //   const {audioCtx, analyser} = res
        //   audioCtxRef.value = audioCtx
        //   analyserRef.value = analyser
        //   draw();
        // });
        return;
      }

      const audioCtx = audioCtxRef.value;

      if (audioCtx.state === 'running') {
        drawHisHanle.value && cancelAnimationFrame(drawHisHanle.value);
        drawHisHanle.value = undefined;
        audioCtx.suspend();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          draw();
        });
      }
    }

    const touching = ref<boolean>(false);
    function onTouchstart(e: TouchEvent) {
      e.preventDefault();
      e.stopPropagation();

      window.navigator.vibrate([100]);

      if (touching.value) {
        return;
      }
      onStart();
      touching.value = true;
      return;
    }
    function onTouchend() {
      onStart();
      touching.value = false;
    }
    function onStopContextmenu(e: MouseEvent) {
      e.preventDefault();
    }

    return () => (<div class={styles.app}>
      <div>
        <Watermelon type={resule.value} />
      </div>
      <div class={styles.his}>
        <canvas ref={canvasRef} />
      </div>
      <div
        class={cn(styles['push-btn'], {[styles.touching]: touching.value})}
        onTouchstart={onTouchstart}
        onTouchend={onTouchend}
        onTouchcancel={onTouchend}
        onContextmenu={onStopContextmenu}
      />
      {hasGranted.value ? <></> : <PerssionApply onGrant={init}/>}
    </div>);
  }

});
