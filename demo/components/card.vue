<style lang="scss" scoped>
.demo-card {
    background: url(https://ej2.syncfusion.com/vue/demos/dist/vertical_img.png?9a97a89e546a825747304b53d9ad0f79)
        no-repeat;
    background-size: cover;
    height: 300px;
    justify-content: flex-end;
    color: #000;
}
</style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Card 卡片)</h2>
            <h4 class="padding-top-10">基础容器，用来显示文字、列表、图文等内容，也可以配合其它组件一起使用。</h4>
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
                <vCol span="8" gutter="20">
                    <vCard v-bind="formData" class="demo-card">
                        <div>
                            Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                            analytics—anything
                        </div>
                    </vCard>
                </vCol>
                <vCol span="5" gutter="20">
                    <vCard v-bind="formData" type="tile" style="width:200px;">
                        <div slot="extra">
                            <img src="https://ej2.syncfusion.com/vue/demos/src/card/images/Tile_10.png" alt />
                        </div>
                        <header slot="title" class="text-center">JavaScript</header>
                        <div>
                            Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                            analytics—anything
                        </div>
                    </vCard>
                </vCol>
                <vCol span="5" gutter="20">
                    <vCard v-bind="formData" type="tile" style="width:200px;">
                        <div slot="extra">
                            <img src="https://ej2.syncfusion.com/vue/demos/src/card/images/Tile_6.png" alt />
                        </div>
                        <header slot="title" class="text-center">JavaScript</header>
                        <div>
                            Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                            analytics—anything
                        </div>
                    </vCard>
                </vCol>
                <vCol span="8" gutter="20">
                    <vCard v-bind="formData" class="demo-card" type="flip">
                        <header slot="title" class="text-center">
                            Mayumi Ohno
                            <p>Marketing Representative</p>
                        </header>
                        <div>
                            Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                            analytics—anything
                        </div>
                        <p slot="extra">Content of card</p>
                    </vCard>
                </vCol>
                <vCol span="8" gutter="20">
                    <vCard v-bind="formData" type="horizontal">
                        <header slot="title" class="text-center">
                            iPhone X
                            <p>Marketing Representative</p>
                        </header>
                        <div>
                            Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                            analytics—anything
                        </div>
                        <img
                            width="100%"
                            slot="extra"
                            src="https://ej2.syncfusion.com/vue/demos/dist/Trimmer.png?20363bb2165af3b8e182b8e91ab93e1d"
                            alt
                        />
                    </vCard>
                </vCol>
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
        return {};
    },
    computed: {
        getCode() {
            return `<vCol span="8" gutter="20">
						<vCard v-bind="${this.getCodeString(this.formData)}" class="demo-card">
							<div>Tech evangelists are currently pounding their pulpits about all things AI, machine learning, analytics—anything</div>
						</vCard>
					</vCol>
					<vCol span="5" gutter="20">
						<vCard v-bind="${this.getCodeString(this.formData)}" type="tile" style="width:200px;">
							<div slot="extra">
								<img src="https://ej2.syncfusion.com/vue/demos/src/card/images/Tile_10.png" alt />
							</div>
							<header slot="title" class="text-center">JavaScript</header>
							<div>Tech evangelists are currently pounding their pulpits about all things AI, machine learning, analytics—anything</div>
						</vCard>
					</vCol>
					<vCol span="5" gutter="20">
						<vCard v-bind="${this.getCodeString(this.formData)}" type="tile" style="width:200px;">
							<div slot="extra">
								<img src="https://ej2.syncfusion.com/vue/demos/src/card/images/Tile_6.png" alt />
							</div>
							<header slot="title" class="text-center">JavaScript</header>
							<div>Tech evangelists are currently pounding their pulpits about all things AI, machine learning, analytics—anything</div>
						</vCard>
					</vCol>
					<vCol span="8" gutter="20">
						<vCard v-bind="${this.getCodeString(this.formData)}" class="demo-card" type="flip">
							<header slot="title" class="text-center">
								Mayumi Ohno
								<p>Marketing Representative</p>
							</header>
							<div>Tech evangelists are currently pounding their pulpits about all things AI, machine learning, analytics—anything</div>
							<p slot="extra">Content of card</p>
						</vCard>
					</vCol>
					<vCol span="8" gutter="20">
						<vCard v-bind="${this.getCodeString(this.formData)}" type="horizontal">
							<header slot="title" class="text-center">
								iPhone X
								<p>Marketing Representative</p>
							</header>
							<div>Tech evangelists are currently pounding their pulpits about all things AI, machine learning, analytics—anything</div>
							<div slot="extra">
								<img
									src="https://ej2.syncfusion.com/vue/demos/dist/Trimmer.png?20363bb2165af3b8e182b8e91ab93e1d"
									alt
								/>
							</div>
						</vCard>
					</vCol>`;
        },
        getBase() {
            return [
                {
                    label: '显示边框',
                    key: 'border',
                    tag: 'vSwitch',
                    default: true,
                },
                {
                    label: '卡片阴影',
                    key: 'shadow',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '头部分割线',
                    key: 'divider',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '反向布局',
                    key: 'reverse',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '卡片内部间距',
                    key: 'padding',
                    tag: 'vInputNumber',
                    default: 16,
                },
                {
                    label: '标题',
                    key: 'title',
                    tag: 'vInput',
                    default: '标题',
                },
                {
                    label: '标题前的图标',
                    key: 'icon',
                    tag: 'vSelect',
                    options: this.iconslist,
                },
            ];
        },
        compProps() {
            return [
                {
                    explain: '卡片类型：flip,tile,horizontal',
                    prop: 'type',
                    type: 'String',
                    default: '-',
                },
                {
                    explain: '是否显示边框，建议在灰色背景下使用',
                    prop: 'border',
                    type: 'Boolean',
                    default: true,
                },
                {
                    explain: '卡片阴影，建议在灰色背景下使用',
                    prop: 'shadow',
                    type: 'Boolean',
                    default: false,
                },
                {
                    explain: '头部分割线',
                    prop: 'divider',
                    type: 'Boolean',
                    default: false,
                },
                {
                    explain: '反向布局',
                    prop: 'reverse',
                    type: 'Boolean',
                    default: false,
                },
                {
                    explain: '卡片内部间距',
                    prop: 'padding',
                    type: 'Number',
                    default: 16,
                },
                {
                    explain: '标题',
                    prop: 'title',
                    type: 'String',
                    default: '-',
                },
                {
                    explain: '继承属性：tag to href 等...',
                    prop: '$attrs',
                    type: 'vSelect',
                    default: '-',
                },
                {
                    prop: '$listeners',
                    explain: '继承事件',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot:title',
                    explain: '自定义卡片标题',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot:extra',
                    explain: '额外显示的内容',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot',
                    explain: '卡片主体内容',
                    type: 'VNode',
                    default: '-',
                },
            ];
        },
    },
};
</script>
