export default {
    functional: true,
    props: {
        row: Object,
        column: Object,
        index: [Number, String],
        axis: Array,
        tag: String,
        render: Function,
    },
    render(h, ctx) {
        const data = ctx.data,
            {row, column = {}, index, tag = "td", render, axis} = ctx.props
        let {style, class: className = [], props = {}, domProps = {}, on = {}} = column,
            vnode = ctx.children || []
      
        style = style && typeof style === "object" ? {...style, ...data.style} : {...data.style}
        if (render && typeof render === "function") vnode[0] = render.call(ctx.parent, h, {row, column, index, axis})
        return h(
            tag,
            {
                on: Object.assign({}, on, data.on, data.nativeOn),
                domProps: Object.assign({}, domProps),
                attrs: Object.assign({"data-axis": axis}, props, data.attrs),
                style,
                class: [...data.class, className],
            },
            [vnode]
        )
    },
}
