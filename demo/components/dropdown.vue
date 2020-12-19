<template>
    <main style="padding:20px 0;" class="examples-main clearfix">
        <vForm class="example" vertical>
            <div style="padding:10px 0;">参数：</div>
            <vFormItem
                v-for="(item,key) of switchs"
                :key="key"
                label-width="100"
                :label="key">
                <vSwitch v-model="switchs[key]" />
            </vFormItem>
            <vFormItem
                v-for="(item,key) of selects"
                :key="key"
                label-width="100"
                :label="key">
                <vSelect v-model="selects[key]" transfer>
                    <vOption
                        v-for="(val,index) of options[key]"
                        :value='val'
                        :key="index"></vOption>
                </vSelect>
            </vFormItem>
            <vFormItem
                v-for="(item,key) of inputs"
                :key="key"
                label-width="100"
                :label="key">
                <vInput v-model="inputs[key]">
                </vInput>
            </vFormItem>
        </vForm>
        <section class="example">
            <vDropdown v-bind="attrs" v-if="value">
                <vButton>vButton</vButton>
                <template slot="list">
                    <vDropdownItem disabled>驴打滚</vDropdownItem>
                    <vDropdownItem selected divided>驴打滚</vDropdownItem>
                    <div  data-vview-module="DropdownItem">炸酱面</div>
                    <div  data-vview-module="DropdownItem">豆汁儿</div>
                    <div  data-vview-module="DropdownItem">
                        <vDropdown>
                            <vButton>vButton</vButton>
                            <template slot="list">
                                <div  data-vview-module="DropdownItem">驴打滚</div>
                                <div  data-vview-module="DropdownItem">炸酱面</div>
                                <div  data-vview-module="DropdownItem">豆汁儿</div>
                                <div  data-vview-module="DropdownItem">冰糖葫芦</div>
                                <div  data-vview-module="DropdownItem">北京烤鸭</div>
                            </template>
                        </vDropdown>
                    </div>
                    <div  data-vview-module="DropdownItem">
                        <vDropdown transfer>
                            <vButton>vButton</vButton>
                            <template slot="list">
                                <div  data-vview-module="DropdownItem">驴打滚</div>
                                <div  data-vview-module="DropdownItem">炸酱面</div>
                                <div  data-vview-module="DropdownItem">豆汁儿</div>
                                <div  data-vview-module="DropdownItem">冰糖葫芦</div>
                                <div  data-vview-module="DropdownItem">北京烤鸭</div>
                            </template>
                        </vDropdown>
                    </div>
                </template>
            </vDropdown>
        </section>
        <h2 class="title">Props & Events #</h2>
        <vTable
            :columns='columns'
            :data="data"
            style="width:100%"
            border
            stripe></vTable>
    </main>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            switchs: {
                transfer: true,
                visible: false,
            },
            selects: {
                trigger: 'click'
            },
            options: {
                trigger: ['click', 'hover', 'custom']
            },
            inputs: {
                placement: "bottom",
            },
        };
    },
    mounted() {
        // setInterval(()=>{
        //     this.value=!this.value
        // },2000)
    },
    computed: {
        attrs() {
            return {
                ...this.selects,
                ...this.switchs,
                ...this.inputs,
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
                width: '50%'
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
                prop: 'transfer',
                explain: "是否在body下",
                type: 'Boolean',
                default: '-',
            },
            {
                prop: 'trigger',
                explain: '触发方式，可选值为 hover（悬停）click（点击）contextMenu（右键）custom（自定义），使用 custom 时，需配合 visible 一起使用',
                type: '	String',
                default: 'click',
            },
            {
                prop: 'placement',
                explain: '下拉菜单出现的位置:left,right,top,bttom,组合',
                type: 'String',
                default: 'bottom',
            },
            {
                prop: 'visible',
                explain: '手动控制下拉框的显示',
                type: 'Boolean',
                default: '-',
            },
            {
                prop: 'on-visible-change',
                explain: '	菜单显示状态改变时调用',
                type: 'Function:val=>{}',
                default: '-',
            },
             {
                prop: 'on-visible-change',
                explain: 'on-visible-change',
                type: 'Function:val=>{}',
                default: '-',
            },
             {
                prop: 'on-click',
                explain: '点击菜单项时触发',
                type: 'Function:val=>{}',
                default: '-',
            },
            ]
        }
    },
};
</script>
