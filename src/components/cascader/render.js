export default {
    name: 'render',
    functional: true,
    props: {
        render: Function,
        data: Object,
        index:Number,
    },
    render: (h, ctx) => {
        const { render, data,index } = ctx.props;
        return render.call(ctx.parent, h, { data, ctx,index});
    }
};