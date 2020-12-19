export default {
    name: 'render',
    functional: true,
    props: {
        render: Function,
        data: Object,
        node: Object,
        tag: String
    },
    render: (h, ctx) => {
        const { render, data, node, tag } = ctx.props;
        if (typeof render === 'function') return render.call(ctx.parent, h, { data, node, ctx });
        return h((tag || 'div'), { ...ctx.data, on: { ...ctx.listeners, ...ctx.data.nativeOn } }, ctx.children)
    }
};