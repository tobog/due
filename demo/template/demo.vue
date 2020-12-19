<style lang="scss">
.demo-wrapper {
    .demo-header {
        padding: 12px;
        border-bottom: 1px solid #ccc;
        line-height: 1.8;
        font-size: 16px;
        h4 {
            font-weight: normal;
            padding-left: 12px;
            padding-top: 10px;
        }
    }
    .demo-props-table,
    .demo-form,
    .demo-view,
    .demo-code,
    .demo-props {
        padding: 12px;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        min-height: 20vh;
    }

    .demo-code pre {
        white-space: pre-wrap;
        margin: 0;
    }

    .demo-table {
        width: 100%;
    }
    .demo-view[data-dark="true"] {
        background-color: #000;
    }
}
</style>

<template>
    <div class="demo-wrapper">
        <component v-if="isDark" :is="'style'">{{ styleCode }}</component>
        <div class="demo-header">
            <span>
                深色
                <vSwitch v-model="isDark" class="margin-10">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </vSwitch>
            </span>
            <slot name="header">
                <h2>代码示例({{ title }})</h2>
            </slot>
            <slot name="desc"> </slot>
        </div>
        <vRow class="demo-layout" flex>
            <vCol :lg="isAll ? 24 : 14" span="24" class="demo-form">
                <FormEdit :formdata="config" v-model="formData"></FormEdit>
            </vCol>
            <vCol :lg="isAll ? 24 : 10" span="24" class="demo-view" :data-dark="isDark">
                <vSwitch v-model="show" class="margin-bottom-10">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </vSwitch>
                <div v-if="show">
                    <slot v-bind="formData"></slot>
                </div>
            </vCol>
        </vRow>
        <div class="demo-code">
            <pre>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
        </div>
        <div class="demo-props-table">
            <h2 class="demo-header">Props & Events</h2>
            <vTable :columns="getColumns" :data="config" class="demo-table" border stripe></vTable>
        </div>
    </div>
</template>

<script>
// const struct = {
//     showConfig: false, //  是否显示demo配置
//     label: "距离顶部", // 字段名称
//     key: "offsetTop", // 字段
//     tag: "vInputNumber", // 渲染类型
//     demoDefault: 10, // 默认值，
//     dataType: "Function:Event",
//     options: "false|top|bottom", // 可选值
//     explain: "在固定状态发生改变时触发",
// }
import FormEdit from "./formedit";
export default {
    components: {
        FormEdit,
    },
    props: {
        title: String,
        isAll: Boolean,
        config: {
            type: Array,
            default() {
                return [];
            },
        },
        code: String,
    },
    data() {
        return {
            show: true,
            formData: {},
            isDark: false,
            styleCode: `
                .demo-view {
                    --title: #fff;
                    --content: #e6e6e6;
                    --sub-content: #777; // 待优化
                    --disable-content: #56565a;
                    --globalBack:#151518;
                    --border:gray;
                    --back: #151518;
            }`,
        };
    },
    watch: {
        formData: {
            deep: true,
            handler(val) {
                this.$emit("on-formData", val);
            },
        },
    },
    computed: {
        getFormatCode() {
            let code = (this.code || "").replace(/v-bind=CODE/g, `v-bind=${this.getCodeString(this.formData)}`);
            return code.replace(/\s{5,}/g, function() {
                const reg = arguments[0],
                    leng = reg.length;
                // console.log(arguments, leng)
                return `\n${reg.slice(leng > 18 ? 20 : 6)}`;
            });
        },
        getColumns() {
            return [
                {
                    title: "属性/事件/方法",
                    key: "key",
                },
                {
                    title: "说明",
                    key: "explain",
                    width: "30%",
                },
                {
                    title: "类型",
                    key: "dataType",
                },
                {
                    title: "默认值/参数/返回值",
                    key: "default",
                },
                {
                    title: "可选值",
                    key: "options",
                },
                // {
                //     title: "切换",
                //     key: "options",
                // },
            ];
        },
    },
    methods: {
        getCodeString(val = {}) {
            try {
                return JSON.stringify(val);
            } catch (error) {
                return val;
            }
        },
    },
};
</script>
