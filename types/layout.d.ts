
import Vue, { VNode } from 'vue';

export declare class Layout extends Vue {
  /**
   * 触发响应式布局的断点，可选值为xs,sm,md,lg,xl或xxl。
   */
  breakpoint?: string;
  /**
   * 	侧边栏是否收起，可使用 v-model 双向绑定数据。
   * @default false
   */
  value?: boolean;
  /**
   * 宽度
   * @default 200
   */
  width?: number | string;
  /**
   * 收缩宽度，设置为 0 会出现特殊 trigger
   * @default 64
   */
  'collapsed-width'?: number | string;
  /**
   * 展开-收起时的回调true/false
   */
  $emit(eventName: 'on-change', value: boolean): this;
  /**
   * methods, 改变Sider展开-收起状态。
   */
  toggleCollapse(): void;
}