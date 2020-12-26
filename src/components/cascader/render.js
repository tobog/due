export default {
    name: "render",
    functional: true,
    props: {
        render: Function,
        data: [Object, Array],
        index: Number,
        isFilter: Boolean,
    },
    render: (h, ctx) => {
        const { render, data, index, isFilter } = ctx.props;
        return render.call(ctx.parent, h, { data, ctx, index, isFilter });
    },
};
