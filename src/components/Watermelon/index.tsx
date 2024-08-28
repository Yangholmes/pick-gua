/**
 * @file 西瓜图片
 * @author Yangholmes 2024-08-20
 */

import { defineComponent, PropType, toRefs } from 'vue';

import cn from 'classnames';

import goodPic from '@/assets/good.webp';
import rawPic from '@/assets/raw.webp';
import overripePic from '@/assets/overripe.webp';

import styles from './index.module.less';

/** 西瓜成熟度 */
export enum Type {
  /** 没有瓜 */
  Null = 0,
  /** 生瓜蛋子 */
  Raw,
  /** 好瓜 */
  Good,
  /** 过熟 */
  Overripe
}

const pic = {
  [Type.Null]: '',
  [Type.Good]: goodPic,
  [Type.Overripe]: overripePic,
  [Type.Raw]: rawPic
};

export default defineComponent({
  name: 'Watermelon',
  props: {
    /** 西瓜成熟度 */
    type: {
      type: Number as PropType<Type>,
      required: true
    }
  },
  setup(props) {
    const {type} = toRefs(props);

    return () => <div class={cn(styles.root)}>
      <div
      class={cn(styles.watermelon)}
      style={{
        backgroundImage: `url(${pic[type.value]})`
      }} /></div>;
  }
});
