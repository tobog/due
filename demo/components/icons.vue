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
        p {
            font-size: 13px;
        }
        &:hover {
            background: #ebf7ff;
        }
    }
}
</style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Icon 图标)</h2>
            <h4 class="padding-top-10">图标使用</h4>
        </vCol>
        <vCol lg="24" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="24" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <section v-if="show">
                <vIcon v-bind="formData">
                    <span>vIcon</span>
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
            </section>
        </vCol>
        <vCol span="24" class="demo-code">
            <pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
        </vCol>
        <vCol span="24" class="demo-props">
            <h2 class="demo-header">Props & Events</h2>
            <vTable :columns="getTableColumns" :data="compProps" class="demo-table" border stripe></vTable>
        </vCol>
        <vCol span="24" class="demo-props">
            <h3 class="padding-15">所有图标</h3>
            <vInput
                class="width-60per margin-auto"
                v-model="iconName"
                placeholder="输入英文关键词搜索，比如 info"
            ></vInput>
            <div class="iconstemp">
                <div v-for="item in getFilterIcon">
                    <vIcon v-bind="formData" :type="item"></vIcon>
                    <p>{{ item }}</p>
                </div>
            </div>
        </vCol>
    </vRow>
</template>

<script>
export default {
    // ${this.getCodeString(this.formData)}
    data() {
        return {
            iconName: "",
        };
    },
    computed: {
        getFilterIcon() {
            if (!this.iconName) return this.iconslist;
            return this.iconslist.filter((item) => item.indexOf(this.iconName) > -1);
        },
        getCode() {
            return `<vIcon v-bind="${this.getCodeString(this.formData)}">vIcon</vIcon>
					<vIcon
						style="width:90px"
						type="https://www.baidu.com/img/dong_5a30169b33012332baafb15938f6f19f.gif"
					></vIcon>`;
        },
        getBase() {
            return [
                {
                    label: "flex-center布局",
                    key: "center",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "颜色",
                    key: "color",
                    tag: "vInput",
                    props: {
                        type: "color",
                    },
                },
                {
                    label: "大小",
                    key: "size",
                    tag: "vInputNumber",
                    default: 26,
                },
                {
                    label: "icon",
                    key: "type",
                    tag: "vInput",
                    default: "ios-archive-outline",
                    options: this.iconslist,
                },
            ];
        },
        compProps() {
            return [
                {
                    prop: "type",
                    explain: "图标的名称,可以是路径或链接",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "size",
                    explain: "大小",
                    type: "Number",
                    default: "-",
                },
                {
                    prop: "color",
                    explain: "color",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "laoding",
                    explain: "laoding 加载loading",
                    type: "String|Boolean",
                    default: "-",
                },
                {
                    prop: "slot:default",
                    explain: "自定义图标",
                    type: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
