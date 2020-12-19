<style lang="scss"></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Collapse 折叠面板)</h2>
            <h4 class="padding-top-10">将内容区域折叠/展开。</h4>
        </vCol>
        <vCol lg="14" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="10" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <section v-if="show">
                <vCollapse v-model="value" v-bind="formData">
                    <vPanel v-bind="formData">
                        <span>史蒂夫·乔布斯</span>
                        <template slot="content">
                            <vCollapse v-model="value2" v-bind="formData">
                                <vPanel>
                                    <span>史蒂夫·乔布斯</span>
                                    <p slot="content">
                                        史蒂夫·乔布斯（Steve
                                        Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。
                                    </p>
                                </vPanel>
                                <vPanel name="2" disabled>
                                    斯蒂夫·盖瑞·沃兹尼亚克
                                    <p slot="content">
                                        斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary
                                        Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC
                                        Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                                    </p>
                                </vPanel>
                                <vPanel name="4" title="乔纳森·伊夫1">
                                    <p slot="content">
                                        乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                                    </p>
                                </vPanel>
                                <vPanel name="5">
                                    乔纳森·伊夫
                                    <p slot="content">
                                        乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                                    </p>
                                </vPanel>
                            </vCollapse>
                        </template>
                    </vPanel>
                    <vPanel>
                        斯蒂夫·盖瑞·沃兹尼亚克
                        <p slot="content">
                            斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary
                            Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC
                            Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                        </p>
                    </vPanel>
                    <vPanel name="3">
                        乔纳森·伊夫
                        <p slot="content">
                            乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人些著名的产品最有影响力的人。
                        </p>
                    </vPanel>
                </vCollapse>
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
    </vRow>
</template>

<script>
export default {
    // ${this.getCodeString(this.formData)}
    data() {
        return {
            value: '1221',
            value2: '22',
        };
    },
    computed: {
        getCode() {
            return `<vCollapse v-model="value" v-bind="${this.getCodeString(this.formData)}">
		                        <vPanel>
		                            <span class="padding-10">史蒂夫·乔布斯</span>
		                            <div slot="content">
		                                <vCollapse v-model="value2" v-bind="${this.getCodeString(this.formData)}">
		                                    <vPanel>
		                                        <span class="padding-10">史蒂夫·乔布斯</span>
		                                        <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
		                                    </vPanel>
		                                    <vPanel name="2">
		                                        斯蒂夫·盖瑞·沃兹尼亚克
		                                        <p
		                                            slot="content"
		                                        >斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
		                                    </vPanel>
		                                    <vPanel name="3">
		                                        乔纳森·伊夫
		                                        <p
		                                            slot="content"
		                                        >乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
		                                    </vPanel>
		                                </vCollapse>
		                            </div>
		                        </vPanel>
		                        <vPanel>
		                            斯蒂夫·盖瑞·沃兹尼亚克
		                            <p
		                                slot="content"
		                            >斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
		                        </vPanel>
		                        <vPanel name="3">
		                            乔纳森·伊夫
		                            <p
		                                slot="content"
		                            >乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人些著名的产品最有影响力的人。</p>
		                        </vPanel>
		                    </vCollapse>
							`;
        },
        getBase() {
            return [
                {
                    label: '手风琴模式',
                    key: 'accordion',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '简洁模式',
                    key: 'simple',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '严格匹配',
                    key: 'strict',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '不可点击',
                    key: 'disabled',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: 'Panel名称',
                    key: 'name',
                    tag: 'vInput',
                    default: '',
                },
                {
                    label: 'Panel标题',
                    key: 'title',
                    tag: 'vInput',
                    default: '',
                },
                {
                    label: 'Panel图标',
                    key: 'icon',
                    tag: 'vSelect',
                    default: 'ios-arrow-forward',
                    options: this.iconslist,
                },
            ];
        },
        compProps() {
            return [
                {
                    explain: '可以使用 v-model 双向绑定数据',
                    prop: 'value',
                    type: 'Array, String, Number',
                    default: 'false',
                },
                {
                    prop: 'multiple',
                    explain: '开启多个panel',
                    type: 'Boolean',
                    default: 'fasle',
                },
                {
                    prop: 'simple',
                    explain: '是否开启简洁模式',
                    type: Boolean,
                    default: false,
                },
                {
                    prop: 'value',
                    explain: '当前激活的面板的 name，可以使用 v-model 双向绑定',
                    type: '[Array, String,Number]',
                    default: '-',
                },
                {
                    prop: 'strict',
                    explain: 'use strict',
                    type: 'Boolean',
                    default: '-',
                },
                {
                    prop: 'on-change',
                    explain: 'on-change',
                    type: 'Function:value=>{}',
                    default: '-',
                },
                {
                    prop: 'Panel:name',
                    explain: '当前面板的 name，与 Collapse的value对应，不填为索引值',
                    type: 'String',
                    default: 'index',
                },
                {
                    prop: 'Panel:slot',
                    explain: '面板头内容',
                    type: 'String',
                    default: '',
                },
                {
                    prop: 'Panel:icon',
                    explain: '面板头图标',
                    type: 'String',
                    default: '',
                },
            ];
        },
    },
};
</script>
