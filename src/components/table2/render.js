

export default {
    functional: true,
    props: {
        row: Object,
        column: Object,
        index: [Number, String],
        axis: Array,
        tag: String,
        render: Function,
        // attrs: Object,
    },
    render(h, ctx) {
        const data = ctx.data,
            { row, column = {}, index, tag = 'td', render, axis } = ctx.props,
            style = typeof column.style == 'string' ? column.style : { ...data.style, ...column.style };
        let vnode = ctx.children || [],
            className = column.class || [];
        className = className instanceof Array ? [...data.class, ...className] : [...data.class, className];
        if (render && typeof render === 'function') vnode[0] = render.call(ctx.parent, h, { row, column, index, axis });
        return h(tag, {
            on: Object.assign({}, column.on, column.nativeOn),
            domProps: Object.assign({}, column.domProps),
            attrs: Object.assign({ "data-axis": axis }, column.attrs, column.props, data.attrs),
            style,
            class: className,
        }, [vnode]);
    }
};
