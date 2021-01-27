<template>
    <div v-bind="getProps" :data-vue-module="$options.name">
        <template v-if="getRatio > 0">
            <div :class="[_tobogPrefix_ + '-ratio-inner']">
                <slot></slot>
            </div>
            <i :class="[_tobogPrefix_ + '-ratio-icon']" :style="{ paddingTop: 100 * getRatio + '%' }"></i>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>
<script>
import { findComponentUpward } from "../../../utils/findComponent"
import { unit } from "../../../utils/tool"
export default {
    name: "Col",
    componentName: "Col",
    props: {
        order: [Number, String],
        span: [Number, String],
        offset: [Number, String],
        push: [Number, String],
        gutter: [Number, String],
        ratio: [Number, String],
        pull: [Number, String],
        xs: [Number, String, Object],
        sm: [Number, String, Object],
        md: [Number, String, Object],
        lg: [Number, String, Object],
        xl: [Number, String, Object],
        xxl: [Number, String, Object],
    },
    data() {
        return {
            Row: {},
        }
    },
    created() {
        this.__media = ""
        this.Row = findComponentUpward(this, "Row") || {}
    },
    computed: {
        getClasses() {
            const isValid = (val) => {
                    return !!val || val === 0
                },
                classes = [],
                prefix = this.__$cssPrefix__,
                getMediaClass = function(obj) {
                    ;["order", "span", "offset", "push", "pull"].forEach(function(key) {
                        if (isValid(this[key])) {
                            const _key = key === "span" ? "" : `-${key}`,
                                media = this.__media ? `-${this.__media}` : ""
                            classes.push(`${prefix}-col${media}${_key}-${this[key]}`)
                        }
                    }, obj)
                }
            getMediaClass(this)
            this.getMediaObj.forEach(getMediaClass)
            return classes
        },
        getMediaObj() {
            const transform = function(val, key) {
                const type = typeof val
                if (type === "string" || type === "number") return { span: val, __media: key }
                if (val && val instanceof Object) return { ...val, __media: key }
            }
            return ["xs", "sm", "md", "lg", "xl", "xxl"]
                .map((key) => {
                    return transform(this[key], key)
                })
                .filter((item) => !!item)
        },
        getStyle() {
            const media = this.getMedia,
                isValid = (val) => {
                    return !!val || val == "0"
                },
                style = {},
                grid = parseInt(this.Row.grid || 0) || 24
            let mediaObject = this[media],
                type = typeof mediaObject
            if (type === "number" || type === "string") {
                mediaObject = { span: mediaObject }
            }
            if (!mediaObject) mediaObject = {}
            const order = isValid(mediaObject.order) ? mediaObject.order : this.order,
                span = isValid(mediaObject.span) ? mediaObject.span : this.span,
                offset = isValid(mediaObject.offset) ? mediaObject.offset : this.offset,
                push = isValid(mediaObject.push) ? mediaObject.push : this.push,
                pull = isValid(mediaObject.pull) ? mediaObject.pull : this.pull
            if (isValid(span)) {
                style.width = ((span / grid) * 100).toFixed(3) + "%"
            }
            if (isValid(offset)) {
                style.marginLeft = ((offset / grid) * 100).toFixed(3) + "%"
            }
            if (isValid(push)) {
                style.left = ((push / grid) * 100).toFixed(3) + "%"
            }
            if (isValid(pull)) {
                style.right = ((pull / grid) * 100).toFixed(3) + "%"
            }
            if (isValid(order)) {
                style.order = order
            }
            return style
        },
        getProps() {
            let [gutter, alignGutter] = this.gutterIn,
                style = {},
                classes = [this._tobogPrefix_, { [`${this._tobogPrefix_}-ratio`]: this.getRatio > 0 }]
            if (this.Row.isCustomeGrid) {
                style = this.getStyle
            } else {
                classes.push(this.getClasses)
            }
            if (gutter && gutter != "0") {
                style.paddingLeft = style.paddingRight = unit(gutter, 0.5)
            }
            if (alignGutter && alignGutter != "0") {
                style.paddingBottom = unit(alignGutter)
            }
            return { style, class: classes }
        },
        getMedia() {
            const size = this.Row.getMediaWidth
            switch (true) {
                case this.xs && size <= 768:
                    return "xs"

                case this.xxl && size >= 1920:
                    return "xxl"

                case this.xl && size >= 1600:
                    return "xl"

                case this.lg && size >= 1200:
                    return "lg"

                case this.md && size >= 992:
                    return "md"

                case this.sm && size >= 768:
                    return "sm"
            }
            return void 0
        },
        gutterIn() {
            let gutter = this.gutter
            let mediaObject = this[this.getMedia]
            if (mediaObject && typeof mediaObject === "object") {
                gutter = mediaObject.gutter
                if (gutter == void 0) gutter = this.gutter
            }
            gutter = gutter != void 0 ? gutter : this.Row.getGutter
            if (Array.isArray(gutter)) {
                return gutter
            }
            return [gutter, gutter]
        },
        getRatio() {
            let ratio = this.ratio
            let mediaObject = this[this.getMedia]
            if (mediaObject && typeof mediaObject === "object") {
                ratio = mediaObject.ratio
                if (ratio == void 0) ratio = this.ratio
            }
            ratio = ratio != void 0 ? ratio : this.Row.getRatio
            return ratio || 0
        },
    },
}
</script>
