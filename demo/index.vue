<style scoped lang="scss">
.menu-item {
    padding: 14px 24px;
    position: relative;
    cursor: pointer;
    z-index: 1;
    transition: all 0.2s ease-in-out;
    display: block;
    color: #333;
    &:hover,
    &.router-link-exact-active {
        color: #2d8cf0;
        background-color: #f0faff;
    }
}

.mens {
    border-right: 1px solid #ccc;
    // padding-top: 60px;
    font-size: 16px;
}
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    border-bottom: 1px solid #ccc;
    z-index: 100;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 30px;
}
.main {
    margin-top: 60px;
}
.nav-title {
    text-transform: uppercase;
    font-size: 22px;
}
.mens-guide {
    padding-top: 20px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
}
</style>

<template>
    <vConfig>
        <nav class="nav">
            <div class="nav-title">Due</div>
        </nav>
        <vRow class="main" flex>
            <vCol span="4" class="mens">
                <div class="mens-guide">
                    <router-link
                        class="menu-item"
                        v-for="(item, index) in guideMenus"
                        :key="index"
                        :to="{ path: item.path }"
                        >{{ item.label }}</router-link
                    >
                </div>
                <div>
                    <router-link
                        class="menu-item"
                        v-for="(item, index) in compMenus"
                        :key="index"
                        :to="{ path: item.path }"
                        >{{ item.path }}&nbsp;&nbsp;{{ item.label }}</router-link
                    >
                </div>
            </vCol>
            <vCol span="20">
                <router-view />
            </vCol>
        </vRow>
    </vConfig>
</template>

<script>
import "./index.scss";

export default {
    name: "App",
    data() {
        return {};
    },
    created() {
        console.log(this, "----------------");
    },
    computed: {
        allMenus() {
            let routes = this.$router.options.routes;
            return this.$router.options.routes[routes.length - 1].children.map((item) => {
                return {
                    path: item.path,
                    label: (item.meta || {}).label || "",
                    guide: (item.meta || {}).type === "guide",
                };
            });
        },
        compMenus() {
            return this.allMenus.filter((item) => !item.guide);
        },
        guideMenus() {
            return this.allMenus.filter((item) => item.guide);
        },
    },
    methods: {},
};
</script>
