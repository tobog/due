
<style>
</style>

<template>
    <main style="padding:20px 0;" class="examples-main">
        <section class="clearfix">
            <div style="padding:10px 0;">视图：</div>
           
            <!-- <vSteps :current="1" status="error">
                <vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
                <vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
                <vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
                <vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
            </vSteps> -->
            <vSteps :current="1" style="height:600px;">
                <vStep title="注册" icon="ios-person"></vStep>
                <vStep title="上传头像" icon="ios-camera"></vStep>
                <vStep title="验证邮箱" icon="ios-mail" next style="height:100px;">
                    <vSteps :current="1" direction="vertical"  style="position:absolute;height:300px;top:100px;left:2px;">
                        <vStep title="注册" icon="ios-person"></vStep>
                        <vStep title="验证邮箱" icon="ios-mail">
                            <vSteps :current="1" order="desc" status="error" style="position:absolute;right:60px;width:600px;">
                                <vStep title="进行中" desc="这里是该步骤的描述信息1"></vStep>
                                <vStep title="待进行" desc="这里是该步骤的描述信息2"></vStep>
                                <vStep title="待进行" desc="这里是该步骤的描述信息3" next></vStep>
                            </vSteps>
                        </vStep>
                        <vStep title="上传头像" icon="ios-camera"></vStep>
                    </vSteps>
                </vStep>
                <vStep title="上传头像" icon="ios-camera"></vStep>
            </vSteps>
            <!-- <vSteps :current="0" status="error" direction="vertical">
                <vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
                <vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
                <vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
                <vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
            </vSteps> -->
        </section>
    
        <h2 class="title">vMessage Props & Events #</h2>
        <vTable :columns='columns' :data="props" style="width:100%" border stripe></vTable>
    
        <h2 class="title">vMessage methods #</h2>
        <vTable :columns='columns' :data="methods" style="width:100%" border stripe></vTable>
    </main>
</template>

<script>
export default {
    methods: {
        drag(axis) {
           
        }
    },
    data() {
        return {
            value: 50,
            value1: 20,
            loading: false,
            attrs: {
                duration: 2,
                content: 'message',
            },
            columns: [{
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
            ],
            props: [{
                prop: 'duration',
                explain: '过度时间',
                type: 'Number',
                default: '-',
            },
            {
                prop: 'name',
                explain: '名称唯一id',
                type: 'String',
                default: '',
            },
            {
                prop: 'render',
                explain: '自定义渲染函数',
                type: 'Function',
                default: '-',
            },
            {
                prop: 'onClose',
                explain: '回调函数',
                type: 'Function',
                default: '-',
            },
            {
                prop: 'content',
                explain: '显示内容',
                type: 'String',
                default: '-',
            },
            ],

            methods: [{
                prop: 'info|success|warning|erro|loadingr|destroy',
                explain: '通过直接调用以下方法来使用组件',
                type: 'Function:options',
                default: 'options',
            },],
        };
    },
};
</script>
