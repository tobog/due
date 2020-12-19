import {EventListener, getClientSize} from "../utils/dom"
import {debounce} from "../utils/tool"
export default {
    inject: ["$ConfigProvide"],
    data() {
        return {
            mediaSize: {},
        }
    },
    beforeCreate() {
        this.__applyResize = true
    },
    created() {
        if (this.$ConfigProvide && this.$ConfigProvide.getConfig.mediaSize.width) {
            this.mediaSize = this.$ConfigProvide.getConfig.mediaSize
            return
        }
        this.__getClientSize = debounce(
            this.__mediaCallback ||
                (() => {
                    this.mediaSize = getClientSize("viewport")
                }),
            100
        )
    },
    mounted() {
        this.bindResize()
    },
    activated() {
        this.bindResize()
    },
    deactivated() {
        this.destroyResize()
    },
    methods: {
        destroyResize() {
            this.__bindresize && EventListener.off(window, "resize", this.__getClientSize)
            this.__bindresize = false
        },
        bindResize() {
            if (this.$ConfigProvide && this.$ConfigProvide.getConfig.mediaSize.width) {
                return
            }
            if (this.__applyResize && !this.__bindresize) {
                this.__bindresize = true
                this.__getClientSize()
                EventListener.on(window, "resize", this.__getClientSize)
            }
        },
        getMediaData(obj, size = this.getMediaWidth) {
            if (!obj || obj === 0 || !(obj instanceof Object))
                return {
                    data: obj,
                    equals: true,
                }
            switch (true) {
                // case obj.xxs >= 0 && size <= 480:
                //     return {
                //         data: obj.xs,
                //         equals: true,
                //     }
                case obj.xs >= 0 && size <= 768:
                    return {
                        data: obj.xs,
                        equals: true,
                        // equals: size > 480,
                    }
                case obj.xxl >= 0 && size >= 1920:
                    return {
                        data: obj.xxl,
                        equals: true,
                    }

                case obj.xl >= 0 && size >= 1600:
                    return {
                        data: obj.xl,
                        equals: size < 1920,
                    }
                case obj.lg >= 0 && size >= 1200:
                    return {
                        data: obj.lg,
                        equals: size < 1600,
                    }
                case obj.md >= 0 && size >= 992:
                    return {
                        data: obj.md,
                        equals: size < 1200,
                    }
                case obj.sm >= 0 && size >= 768:
                    return {
                        data: obj.sm,
                        equals: size < 992,
                    }
            }
            return {
                data: void 0,
                equals: false,
            }
        },
        compareMedia(bearkpoint, bearkpoint2) {
            return this.getBearkpoints.indexOf(bearkpoint) - this.getBearkpoints.indexOf(bearkpoint2)
        },
    },
    computed: {
        getBearkpoints() {
            return ["xs", "sm", "md", "lg", "xl", "xxl"]
        },
        getMedia() {
            const size = this.getMediaWidth
            switch (true) {
                case size <= 768:
                    return "xs"
                case size >= 1920:
                    return "xxl"
                case size >= 1600:
                    return "xl"
                case size >= 1200:
                    return "lg"
                case size >= 992:
                    return "md"
                case size >= 768:
                    return "sm"
            }
            return "md"
        },
        getMediaWidth() {
            return (this.mediaSize && this.mediaSize.width) || 1201
        },
    },
    watch: {
        "$ConfigProvide.getConfig"(val, old) {
            // console.log(this.$ConfigProvide, this.$options.name, "watch")
            if (old && val && val.mediaSize.width !== old.mediaSize.width) {
                this.mediaSize = val.mediaSize
            }
        },
    },
    beforeDestroy() {
        this.destroyResize()
        this.__getClientSize && this.__getClientSize.cancel()
        this.__getClientSize = null
    },
}
