<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Avatar 头像)</h2>
            <h4 class="padding-top-10">用来代表用户或事物，支持图片、图标或字符展示。</h4>
        </vCol>
        <vCol lg="14" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="10" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <div v-if="show">
                <vAvatar class="margin-right-10" v-bind="formData" src="ios-person" />
                <vAvatar class="margin-right-10" v-bind="formData">U</vAvatar>
                <vAvatar class="margin-right-10" v-bind="formData">USER</vAvatar>
                <vAvatar
                    class="margin-right-10"
                    v-bind="formData"
                    src="https://i.loli.net/2017/08/21/599a521472424.jpg"
                />
                <vAvatar class="margin-right-10" v-bind="formData" src="https://tem/d.png">
                    <img slot="fallback" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="" />
                </vAvatar>
                <vAvatar class="margin-right-10" v-bind="formData" style="color: #f56a00;background-color: #fde3cf"
                    >U</vAvatar
                >
                <vAvatar class="margin-right-10" v-bind="formData" style="background-color: #87d068" src="ios-person" />
                <vAvatar class="margin-right-10" v-bind="formData" />
            </div>
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
    </vRow>
</template>

<script>
export default {
    data() {
        return {
            formData: {},
        };
    },

    computed: {
        getBase() {
            return [
                {
                    label: '图标类型',
                    key: 'src',
                    tag: 'vSelect',
                    default: 'ios-person',
                    options: this.iconslist,
                },
                {
                    label: '形状',
                    key: 'shape',
                    tag: 'vSelect',
                    default: 'circle',
                    options: [
                        {
                            value: 'square',
                            label: 'square',
                        },
                        {
                            value: 'circle',
                            label: 'circle',
                        },
                        {
                            value: 'rounded',
                            label: 'rounded',
                        },
                    ],
                },
                {
                    label: '大小',
                    key: 'size',
                    tag: 'vInput',
                    // default: "ios-person",
                    options: [
                        {
                            value: 'large',
                            label: 'large',
                        },
                        {
                            value: 'small',
                            label: 'small',
                        },
                        {
                            value: 'normal',
                            label: 'normal',
                        },
                    ],
                },
            ];
        },
        getCode() {
            return `<vAvatar v-bind="${this.getCodeString(this.formData)}" icon="ios-person" />
                    <vAvatar v-bind="formData">U</vAvatar>
                    <vAvatar v-bind="formData">USER</vAvatar>
                    <vAvatar v-bind="formData" icon="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                    <vAvatar v-bind="formData" style="color: #f56a00;background-color: #fde3cf">U</vAvatar>
                    <vAvatar v-bind="formData" style="background-color: #87d068" icon="ios-person" />
                    <vAvatar v-bind="formData" />`;
        },
        compProps() {
            return [
                {
                    prop: 'src',
                    explain: '设置头像的图标类型，参考 Icon 组件',
                    type: 'string',
                    default: '-',
                },
                {
                    prop: 'size',
                    explain: '设置头像的大小，可选值为 large、small、default，设置具体数值',
                    type: 'String | Number',
                    default: '-',
                },
                {
                    prop: 'shape',
                    explain: '指定头像的形状，可选值为 circle、square',
                    type: 'String',
                    default: 'circle',
                },
                {
                    prop: 'slot',
                    explain: '自定义头像',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'on-error',
                    explain: 'icon为外链接图片加载不成功时触发',
                    type: 'Funtion',
                    default: '-',
                },
            ];
        },
    },
};
</script>
