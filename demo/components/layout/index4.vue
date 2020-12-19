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
    <vLayout class="demo-color">
        <vAside>
            Slider
        </vAside>
        <vLayout>
            <vHeader fixed>
                Header
            </vHeader>
            <vContent>
                Content
            </vContent>
        </vLayout>
        <vAside right>
            Slider
        </vAside>
        <vFooter>
            vFooter
        </vFooter>
    </vLayout>
</template>

<script>
export default {
    data() {
        return {
            formData: {},
        };
    },
    created() {
        window.addEventListener('message', (e) => {
            this.formData = e.data;
        });
    },
};
</script>
