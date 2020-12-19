<template>
    <main style="padding:20px 0;" class="examples-main clearfix">
        <vForm class="example" vertical>
            <div style="padding:10px 0;">参数：</div>
            <vFormItem
                v-for="(item,key) of switchs"
                :key="key"
                label-width="100"
                :label="key"
            >
                <vSwitch v-model="switchs[key]" />
            </vFormItem>
            <vFormItem
                v-for="(item,key) of selects"
                :key="key"
                label-width="100"
                :label="key"
            >
                <vSelect v-model="selects[key]" transfer>
                    <vOption
                        v-for="(val,index) of options[key]"
                        :value='val'
                        :key="index"
                    ></vOption>
                </vSelect>
            </vFormItem>
        </vForm>
        <div class="example">
            <vAlert v-bind="attrs">vAlert props</vAlert>
            <vAffix offsetTop="30"><vAlert v-bind="attrs">vAlert props</vAlert></vAffix>
        </div>
        <h2 class="title">vAlert Props & Events #</h2>
        <vTable
            :columns='columns'
            :data="data"
            style="width:100%"
            border
            stripe
        ></vTable>
    </main>
</template>

<script>
export default {

    computed: {
        attrs() {
            return {
                ...this.selects,
                ...this.switchs
            }
        },
        columns() {
            return [{
                title: '属性/事件/方法',
                key: 'prop',
            },
            {
                title: '说明',
                key: 'explain',
            },
            {
                title: '类型',
                key: 'type',
            },
            {
                title: '默认值/参数/返回值',
                key: 'default',
            },
            ]
        },
        data() {
            return [{
                prop: 'type',
                explain: '类型：success, info, warning, error',
                type: 'string',
                default: 'info',
            },
            {
                prop: 'closable',
                explain: 'closable',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'showIcon',
                explain: 'showIcon',
                type: 'Boolean',
                default: 'true',
            },
            {
                prop: 'ghost',
                explain: 'ghost',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'on-close',
                explain: 'on-close',
                type: 'Function:()=>{}',
                default: '-',
            },
            {
                prop: 'slot',
                explain: '显示内容',
                type: 'VNode',
                default: '-',
            },
            {
                prop: 'slot:desc',
                explain: '显示内容desc',
                type: 'VNode',
                default: '-',
            }
            ]
        }
    },
    data() {
        return {
            switchs: {
                closable: true,
                showIcon: true,
                ghost: true,
            },
            selects: {
                type: 'info',
            },
            options: {
                type: ['success', 'info', 'warning', 'error']
            },
        };
    },
};
</script>
