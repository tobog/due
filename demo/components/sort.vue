<style lang="scss" scoped></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Sort 排序ICON)</h2>
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
                val：{{val}} <vSort v-model="val" v-bind="formData"></vSort>
            </section>
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
            val: '',
        }
    },
    methods: {},
    computed: {
        getBase() {
            return [
                {
                    label: "排序",
                    key: "sort",
                    tag: "vSelect",
                    default: "",
                    options: ["desc", "asc", ""],
                },
                {
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "",
                    options: this.getThemes,
                },
            ]
        },
        compProps() {
            return []
        },
    },
}
</script>
