<style lang="scss" scoped>
.iconstemp {
    overflow: hidden;
    margin-top: 15px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    & > div {
        text-align: center;
        width: 145px;
        height: 100px;
        padding: 16px;
        cursor: pointer;
        border-radius: 4px;
        position: relative;
        p {
            font-size: 13px;
        }
        &:hover {
            background: #ebf7ff;
        }
        /deep/ .due-icons {
            font-size: 26px;
        }
        &:hover .icons-copy {
            display: block;
        }
        .icons-copy {
            display: none;
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            top: 0;
            padding: 10px 0;
            text-align: center;
            background-color: rgba(#000000, 0.7);
            color: #fff;
            border-radius: 4px;
        }
        .icons-copy1,
        .icons-copy2 {
            position: absolute;
            width: 50%;
            left: 0;
            bottom: 0;
            padding: 10px 0;
        }
        .icons-copy2 {
            left: unset;
            right: 0;
        }
    }
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Icon 图标)</h2>
            <h4 class="padding-top-10">图标使用</h4>
        </template>
        <template v-slot="config">
            <vIcon v-bind="config">
                <span>测试</span>
            </vIcon>
            <vIcon
                style="width:90px"
                type="https://www.baidu.com/img/dong_5a30169b33012332baafb15938f6f19f.gif"
            ></vIcon>
            <vIcon
                style="width:90px"
                type="https://www.com.c"
                fallback="https://www.baidu.com/img/dong_5a30169b33012332baafb15938f6f19f.gif"
            ></vIcon>
            <vIcon
                style="width:90px"
                type="https://www.com.c"
                loading="https://www.baidu.com/img/flexible/logo/pc/result.png"
                fallback="https://www.baidu.com/img/dong_5a30169b33012332baafb15938f6f19f.gif"
            ></vIcon>
        </template>
        <div slot="other" slot-scope="config">
            <h3 class="padding-15">所有图标</h3>
            <vInput
                class="width-60per margin-auto"
                v-model="iconName"
                placeholder="输入英文关键词搜索，比如 info"
            ></vInput>
            <div class="iconstemp">
                <div v-for="item in getFilterIcon" :key="item">
                    <vIcon v-bind="config" :type="item"></vIcon>
                    <p>{{ item }}</p>
                    <div class="icons-copy">
                        <span
                            class="icons-copy1"
                            v-v-Clipboard.copy="handleSuccess"
                            :data-clipboard-text="getCodeCopy(item, config)"
                            >复制组件</span
                        >
                        <span class="icons-copy2" v-v-Clipboard.copy="handleSuccess" :data-clipboard-text="item"
                            >复制类型</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            iconName: "",
        }
    },
    // created() {
    //     console.log(this)
    // },
    methods: {
        handleSuccess(value) {
            this.$VNotice.success({
                title: value,
                duration: 0,
            })
        },
        getCodeCopy(type, config) {
            return `<Icon v-bind="${JSON.stringify(config)}" :type="${type}"></Icon>`
        },
    },
    computed: {
        getFilterIcon() {
            if (!this.iconName) return this.iconslist
            return this.iconslist.filter((item) => item.indexOf(this.iconName) > -1)
        },
        getCode() {
            return `<Icon v-bind=CODE>vIcon</Icon>
					<Icon
						style="width:90px"
						type="https://www.baidu.com/img/dong_5a30169b33012332baafb15938f6f19f.gif"
					></Icon>
					`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "center布局",
                    key: "center",
                    demoDefault: false,
                    explain: "flex-center布局",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "颜色",
                    key: "color",
                    demoDefault: "",
                    explain: "颜色",
                    dataType: "String",
                    tag: "vColorPicker",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "大小",
                    key: "size",
                    demoDefault: 22,
                    explain: "大小",
                    dataType: "String|Number",
                    tag: "vInput",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "icon",
                    key: "type",
                    demoDefault: "ios-archive-outline",
                    explain: "icon,图标的名称,可以是路径或链接",
                    dataType: "String",
                    tag: "vInput",
                    default: "",
                    options: this.iconslist,
                },
                {
                    label: "加载loading",
                    key: "loading",
                    demoDefault: "",
                    explain: "laoding 加载loading",
                    dataType: "String|Boolean",
                    default: "",
                },
                {
                    label: "回退图片",
                    key: "fallback",
                    explain: "回退图片，可选值如type 属性",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "显示的内容",
                    key: "slot:default",
                    explain: "自定义图标",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "loading内容",
                    key: "slot:loading",
                    explain: "自定义loading图标",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "回退内容",
                    key: "slot:fallback",
                    explain: "自定义fallback图标",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-error",
                    explain: "图片加载失败",
                    dataType: "Function：Event",
                    default: "()=>{}",
                },
            ]
        },
    },
}
</script>
