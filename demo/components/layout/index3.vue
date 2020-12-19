<style lang="scss">
.demo-color {
    font-size: 30px;
    color: #fff;
    min-height: 120vh;
    .due-layout-header,
    .due-layout-footer {
        background: #7cbce9;
    }

    .due-layout-aside {
        background: #3a9fe8;
    }

    .due-layout-content {
        background: #0f8de9;
        min-height: 100px;
    }
}
</style>
<template>
    <vLayout class="demo-color" :key="JSON.stringify(formData)">
        <vAside :width="formData['Aside:width']" :fixed="formData['Aside:fixed']">
            Slider
        </vAside>
        <vLayout>
            <vHeader
                :height="formData['Header:height']"
                :fixed="formData['Header:fixed']"
                :breakpoint="formData['Aside:breakpoint']"
            >
                Header
            </vHeader>
            <vContent>
                Content
            </vContent>
            <vFooter :fixed="formData['Footer:fixed']" :height="formData['Footer:height']">
                vFooter
            </vFooter>
        </vLayout>
        <vAside right :width="formData['Aside:width']" :fixed="formData['AsideRight:fixed']">
            Slider
        </vAside>
    </vLayout>
</template>

<script>
export default {
    data() {
        return {
            formData: {},
        }
    },
    created() {
        window.addEventListener("message", (e) => {
            this.formData = e.data
        })
    },
}
</script>
