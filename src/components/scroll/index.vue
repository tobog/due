<template>
    <div :data-vue-module="$options.name" :class="classes" :style="getStyle">
        <div v-if="isReachTop" :class="[_tobogPrefix_ + '-placeholder']" data-direction="up" :data-active="direction <= -2">
            <div :class="[_tobogPrefix_ + '-placeholder-inner']">
                <slot v-if="!!message" name="message">
                    {{ message }}
                </slot>
                <slot v-else name="loading">
                    <Loading :loading="true" fix :closable="false"></Loading>
                </slot>
            </div>
        </div>
        <slot></slot>
        <div :class="[_tobogPrefix_ + '-placeholder']" data-direction="down" :data-active="direction >= 2">
            <div :class="[_tobogPrefix_ + '-placeholder-inner']">
                <slot v-if="!!message" name="message">
                    {{ message }}
                </slot>
                <slot v-else name="loading">
                    <Loading :loading="true" fix :closable="false"></Loading>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
import { ScrollLoad } from "../../utils/dom"
import { unit } from "../../utils/tool"
import Loading from "../loading/loading.vue"
export default {
    name: "Scroll",
    components: {
        Loading,
    },
    props: {
        height: {
            type: Number,
            default: 300,
        },
        offset: {
            type: Number,
            default: 30,
        },
        isReachTop: {
            type: Boolean,
            default: true,
        },
        onReachEdge: Function,
        // maskable: Boolean,
    },
    data() {
        return {
            direction: 0, //0；无， 1 ： down;-1：up,
            message: null,
        }
    },
    mounted() {
        this.setScrollLoad()
    },
    watch: {
        isReachTop(val, old) {
            !!val !== !!old && this.setScrollLoad()
        },
        offset() {
            this.setScrollLoad()
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-down`]: this.direction >= 1,
                    [`${_tobogPrefix_}-up`]: this.direction <= -1,
                    [`${_tobogPrefix_}-message`]: !!this.message,
                    // [`${_tobogPrefix_}-mask`]: true || (this.maskable && this.direction != 0 && !this.message),
                },
            ]
        },
        getStyle() {
            return this.height ? { height: unit(this.height, "px") } : {}
        },
    },
    methods: {
        setScrollLoad() {
            if (!this._isMounted || typeof this.onReachEdge !== "function") return
            this.$nextTick(() => {
                if (!this.$el) return
                if (this.__scrollLoad) {
                    this.__scrollLoad.update(this.$el, {
                        isReachTop: this.isReachTop,
                        offset: this.offset,
                    })
                } else {
                    this.__scrollLoad = new ScrollLoad(
                        this.$el,
                        {
                            isReachTop: this.isReachTop,
                            offset: this.offset,
                        },
                        this.handleCallback
                    )
                }
            })
        },
        async handleCallback(direction) {
            direction = direction ? 1 : -1
            this.direction = direction
            await Promise.resolve().then(() => {
                this.$el.scrollTop = direction >= 1 ? this.$el.scrollHeight : 0
                this.direction = direction <= -1 ? -2 : 2
            })
            clearTimeout(this.__tipTimeOut)
			this.message = null;
			// this.$el.style.overflow ='hidden';
            await this.onReachEdge(direction)
                .then((data) => {
                    this.message = (data && data.message) || null
                })
                .catch((err) => {
                    this.message = (err && err.message) || null
                })
            if (this.message) {
                this.__tipTimeOut = setTimeout(() => {
                    this.direction = 0
                    this.message = null
                }, 3000)
            } else {
                this.direction = 0
            }
        },
        beforeDestroy() {
            clearTimeout(this.__tipTimeOut)
            this.__scrollLoad && this.__scrollLoad.destroy()
            this.__scrollLoad = null
        },
    },
}
</script>
