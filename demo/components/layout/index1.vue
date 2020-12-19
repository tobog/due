<style lang="scss">
.demo-layout {
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
        min-height: 200px;
    }
}
</style>
<template>
    <vConfig>
        <vLayout class="demo-layout">
            <vHeader :height="formData['Header:height']" :fixed="formData['Header:fixed']">
                Header
            </vHeader>
            <vAside
                :width="formData['Aside:width']"
                :fixed="formData['Aside:fixed']"
                :breakpoint="formData['Aside:breakpoint']"
            >
                Slider
            </vAside>
            <vContent>
                Content
            </vContent>
            <vAside right :width="formData['Aside:width']" :fixed="formData['AsideRight:fixed']">
                Slider
            </vAside>
            <vFooter :fixed="formData['Footer:fixed']" :height="formData['Footer:height']">
                vFooter
            </vFooter>
        </vLayout>
    </vConfig>
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
