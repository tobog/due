export default {
    name: 'render',
    functional: true,
    props: {
        render: Function,
        parent: Object,
        node: Object,
    },
    render: (h, ctx) => {
        const { render, parent, node } = ctx.props;
        return render.call(ctx.parent, h, { parent, node, ctx });
    }
};