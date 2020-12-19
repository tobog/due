
import { UIComponent, VNode } from './component'

export type AffixEventParam = false | 'top' | 'bottom';
export declare class Affix extends UIComponent {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   * @default 0
   */
  'offset-top'?: number;
  /**
   * 距离窗口底部达到指定偏移量后触发
   */
  'offset-bottom'?: number;
  /**
   * 层级
   *  @default 100
   */
  'z-index'?: number;
  /**
   * 在固定状态发生改变时触发
   * @param value AffixEventParam
   */
  $emit(eventName: 'on-change', value: AffixEventParam): this;
  /**
  * slot插槽对象
  */
  $slots: {
    /**
     * @default 
     */
    default: VNode[];
  };
}