import Vue from "vue"
import Router from "vue-router"
import Index from "./index"
Vue.use(Router)

export default new Router({
    mode: "hash",
    routes: [
        {
            path: "/layout/index1",
            component: () => import("./components/layout/index1"),
            meta: {
                label: "布局1",
            },
        },
        {
            path: "/layout/index2",
            component: () => import("./components/layout/index2"),
            meta: {
                label: "布局2",
            },
        },
        {
            path: "/layout/index3",
            component: () => import("./components/layout/index3"),
            meta: {
                label: "布局3",
            },
        },
        {
            path: "/layout/index4",
            component: () => import("./components/layout/index4"),
            meta: {
                label: "布局4",
            },
        },
        {
            path: "/",
            component: Index,
            children: [
                {
                    path: "guide",
                    component: () => import("./views/guide"),
                    meta: {
                        label: "关于Due",
                        type: "guide",
                    },
                },
                {
                    path: "base",
                    component: () => import("./views/base"),
                    meta: {
                        label: "基础",
                        type: "guide",
                    },
                },
                {
                    path: "layout",
                    component: () => import("./components/layout/index"),
                    meta: {
                        label: "布局",
                    },
                },
                {
                    path: "affix",
                    component: () => import("./components/affix"),
                    meta: {
                        label: "图钉",
                    },
                },
                {
                    path: "alert",
                    component: () => import("./components/alert"),
                    meta: {
                        label: "警告提示",
                    },
                },
                {
                    path: "anchor",
                    component: () => import("./components/anchor"),
                    meta: {
                        label: "锚点",
                    },
                },
                {
                    path: "avatar",
                    component: () => import("./components/avatar"),
                    meta: {
                        label: "头像",
                    },
                },
                {
                    path: "badge",
                    component: () => import("./components/badge"),
                    meta: {
                        label: "徽标数",
                    },
                },
                {
                    path: "bread",
                    component: () => import("./components/bread"),
                    meta: {
                        label: "面包屑",
                    },
                },
                {
                    path: "button",
                    component: () => import("./components/button"),
                    meta: {
                        label: "按钮",
                    },
                },
                {
                    path: "card",
                    component: () => import("./components/card"),
                    meta: {
                        label: "卡片",
                    },
                },
                {
                    path: "carousel",
                    component: () => import("./components/carousel"),
                    meta: {
                        label: "走马灯",
                    },
                },
                {
                    path: "cascader",
                    component: () => import("./components/cascader"),
                    meta: {
                        label: "级联",
                    },
                },
                {
                    path: "checkbox",
                    component: () => import("./components/checkbox"),
                    meta: {
                        label: "多选框",
                    },
                },
                {
                    path: "circle",
                    component: () => import("./components/circle"),
                    meta: {
                        label: "进度环",
                    },
                },
                {
                    path: "collapse",
                    component: () => import("./components/collapse"),
                    meta: {
                        label: "折叠面板",
                    },
                },
                {
                    path: "color",
                    component: () => import("./components/color"),
                    meta: {
                        label: "调色板",
                    },
                },
                {
                    path: "datepicker",
                    component: () => import("./components/datepicker"),
                    meta: {
                        label: "日期选择器",
                    },
                },
                {
                    path: "popper",
                    component: () => import("./components/popper"),
                    meta: {
                        label: "下拉组件",
                    },
                },
                {
                    path: "dragmove",
                    component: () => import("./components/dragmove"),
                    meta: {
                        label: "拖动",
                    },
                },
                {
                    path: "dropdown",
                    component: () => import("./components/dropdown"),
                    meta: {
                        label: "下拉菜单",
                    },
                },
                {
                    path: "fluid",
                    component: () => import("./components/fluid"),
                    meta: {
                        label: "流布局",
                    },
                },
                {
                    path: "form",
                    component: () => import("./components/form"),
                    meta: {
                        label: "表单",
                    },
                },
                {
                    path: "grid-row",
                    component: () => import("./components/grid-row"),
                    meta: {
                        label: "栅格/Row-Col",
                    },
                },
                {
                    path: "grid",
                    component: () => import("./components/grid"),
                    meta: {
                        label: "单元格/Grid",
                    },
                },
                {
                    path: "icons",
                    component: () => import("./components/icons"),
                    meta: {
                        label: "图标",
                    },
                },
                {
                    path: "input",
                    component: () => import("./components/input"),
                    meta: {
                        label: "输入框",
                    },
                },
                {
                    path: "inputNumber",
                    component: () => import("./components/inputNumber"),
                    meta: {
                        label: "数字输入框",
                    },
                },
                {
                    path: "loading",
                    component: () => import("./components/loading"),
                    meta: {
                        label: "加载器",
                    },
                },
                {
                    path: "loadingbar",
                    component: () => import("./components/loadingbar"),
                    meta: {
                        label: "加载进度条",
                    },
                },
                {
                    path: "menu",
                    component: () => import("./components/menu"),
                    meta: {
                        label: "导航菜单",
                    },
                },
                {
                    path: "message",
                    component: () => import("./components/message"),
                    meta: {
                        label: "全局提示",
                    },
                },
                {
                    path: "modal",
                    component: () => import("./components/modal"),
                    meta: {
                        label: "模态框",
                    },
                },
                {
                    path: "notice",
                    component: () => import("./components/notice"),
                    meta: {
                        label: "通知提醒",
                    },
                },
                {
                    path: "page",
                    component: () => import("./components/page"),
                    meta: {
                        label: "分页",
                    },
                },
                {
                    path: "progress",
                    component: () => import("./components/progress"),
                    meta: {
                        label: "进度条",
                    },
                },
                {
                    path: "radio",
                    component: () => import("./components/radio"),
                    meta: {
                        label: "单选框",
                    },
                },
                {
                    path: "rate",
                    component: () => import("./components/rate"),
                    meta: {
                        label: "评分",
                    },
                },
                {
                    path: "resize",
                    component: () => import("./components/resize"),
                    meta: {
                        label: "调整",
                    },
                },
                {
                    path: "scroll",
                    component: () => import("./components/scroll"),
                    meta: {
                        label: "无限滚动",
                    },
                },
                {
                    path: "scrollsync",
                    component: () => import("./components/scrollsync.vue"),
                    meta: {
                        label: "同步器",
                    },
                },
                {
                    path: "select",
                    component: () => import("./components/select"),
                    meta: {
                        label: "选择器",
                    },
                },
                {
                    path: "slider",
                    component: () => import("./components/slider.vue"),
                    meta: {
                        label: "滑块",
                    },
                },
                {
                    path: "sort",
                    component: () => import("./components/sort.vue"),
                    meta: {
                        label: "排序",
                    },
                },
                {
                    path: "split",
                    component: () => import("./components/split.vue"),
                    meta: {
                        label: "面板分割",
                    },
                },
                {
                    path: "step",
                    component: () => import("./components/step"),
                    meta: {
                        label: "步骤条",
                    },
                },
                {
                    path: "switchs",
                    component: () => import("./components/switchs"),
                    meta: {
                        label: "开关",
                    },
                },
                {
                    path: "table",
                    component: () => import("./components/table"),
                    meta: {
                        label: "表格",
                    },
                },
                {
                    path: "tabs",
                    component: () => import("./components/tabs"),
                    meta: {
                        label: "标签页",
                    },
                },
                {
                    path: "tag",
                    component: () => import("./components/tag"),
                    meta: {
                        label: "标签",
                    },
                },
                {
                    path: "textarea",
                    component: () => import("./components/textarea"),
                    meta: {
                        label: "文本域",
                    },
                },
                {
                    path: "timeline",
                    component: () => import("./components/timeline"),
                    meta: {
                        label: "时间轴",
                    },
                },
                {
                    path: "tooltip",
                    component: () => import("./components/tooltip"),
                    meta: {
                        label: "文字提示",
                    },
                },
                {
                    path: "transfer",
                    component: () => import("./components/transferlist"),
                    meta: {
                        label: "穿梭框",
                    },
                },
                {
                    path: "tree",
                    component: () => import("./components/tree"),
                    meta: {
                        label: "树形控件",
                    },
                },
                {
                    path: "upload",
                    component: () => import("./components/upload"),
                    meta: {
                        label: "上传",
                    },
                },
                //  {
                //     path: "tailor",
                //     component: () => import('./components/tailor'),
                //     meta: {
                //         label: '裁剪'
                //     },
                // }
            ],
        },
    ],
})
