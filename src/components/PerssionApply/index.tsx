/**
 * @file 授权说明页
 * @author Yangholmes 2024-08-21
 */

import { defineComponent } from 'vue';
import cn from 'classnames';

import goodPic from '@/assets/good.webp';
import rawPic from '@/assets/raw.webp';
import overripePic from '@/assets/overripe.webp';

import styles from './index.module.less';

const tips = [{
  img: rawPic,
  tip: '生瓜蛋子'
}, {
  img: goodPic,
  tip: '好瓜'
}, {
  img: overripePic,
  tip: '熟过头了'
}];

export default defineComponent({
  name: 'PerssionApply',
  emits: {
    grant() {
      return true;
    }
  },
  setup(_, { emit }) {

    function onGrant() {
      emit('grant');
    }

    return () => <div class={cn(styles['perssion-apply'])}>
      <div class={cn(styles.mask)} />
      <div class={cn(styles.content)}>
        <p>挑个好瓜</p>
        <p>
          <p>拍一拍西瓜</p>
          <p>同时使用手机话筒聆听西瓜的声音</p>
          <p>请允许话筒使用的授权哦~</p>
        </p>
        <ul class={cn(styles.tips)}>
          {tips.map(t => <li key={t.tip}>
            <div class={cn(styles.tip)}>
              <img src={t.img} alt={t.tip} />
              <span>{t.tip}</span>
            </div>
          </li>)}
        </ul>
        <div
          class={cn(styles['grant-btn'])}
          onClick={onGrant}
        />
      </div>

    </div>;
  }
});
