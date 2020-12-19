<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Alert 警告提示)</h2>
            <h4 class="padding-top-10">静态地呈现一些警告信息，可手动关闭</h4>
        </vCol>
        <vCol lg="14" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="10" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <vAlert v-if="show" v-bind="formData"
                >vAlert offsetBottom Content of prompt. Content of prompt. Content of prompt. Content of prompt. Content
                of prompt. Content of prompt. Content of prompt. Content of prompt.333</vAlert
            >
            <vAlert v-if="show" v-bind="formData">
                vAlert offsetBottom
                <div slot="desc">
                    Content of prompt. Content of prompt. Content of prompt. Content of prompt.
                </div>
            </vAlert>
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
                    label: '可关闭',
                    key: 'closable',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '显示图标',
                    key: 'showIcon',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '幽灵透明',
                    key: 'ghost',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '广播',
                    key: 'broadcast',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '类型',
                    key: 'type',
                    tag: 'vSelect',
                    default: 'info',
                    options: [
                        {
                            value: 'info',
                            label: 'info',
                        },
                        {
                            value: 'warning',
                            label: 'warning',
                        },
                        {
                            value: 'error',
                            label: 'error',
                        },
                        {
                            value: 'success',
                            label: 'success',
                        },
                        {
                            value: 'loading',
                            label: 'loading',
                        },
                    ],
                },
                {
                    label: '垂直位置',
                    key: 'align',
                    tag: 'vSelect',
                    default: 'info',
                    options: [
                        {
                            value: 'start',
                            label: 'start',
                        },
                        {
                            value: 'center',
                            label: 'center',
                        },
                        {
                            value: 'end',
                            label: 'end',
                        },
                    ],
                },
                {
                    label: '自定义颜色',
                    key: 'color',
                    tag: 'vInput',
                },
                {
                    label: '描述',
                    key: 'desc',
                    tag: 'vTextarea',
                    span: 24,
                },
            ];
        },
        getCode() {
            return `<vAlert v-bind='${this.getCodeString(this.formData)}'>
							vAlert offsetBottom
						</vAlert>`;
        },
        compProps() {
            return [
                {
                    prop: 'type',
                    explain: '警告提示样式，可选值为：success, info, warning, error,loading',
                    type: 'string',
                    default: 'info',
                },
                {
                    prop: 'closable',
                    explain: '是否可关闭',
                    type: 'Boolean',
                    default: 'false',
                },
                {
                    prop: 'broadcast',
                    explain: '是否可广播',
                    type: 'Boolean',
                    default: 'false',
                },
                {
                    prop: 'showIcon',
                    explain: '是否显示图标',
                    type: 'Boolean',
                    default: 'true',
                },
                {
                    prop: 'ghost',
                    explain: '幽灵透明',
                    type: 'Boolean',
                    default: 'false',
                },
                {
                    prop: 'on-close',
                    explain: '关闭时触发',
                    type: 'Event',
                    default: '-',
                },
                {
                    prop: 'slot:default',
                    explain: '警告提示内容',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot:desc',
                    explain: '警告提示辅助性文字介绍',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot:close',
                    explain: '自定义关闭内容',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot:icon',
                    explain: '自定义图标内容',
                    type: 'VNode',
                    default: '-',
                },
            ];
        },
    },
};
</script>
