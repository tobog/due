export default {
    name: "RenderCell",
    functional: true,
    props: {
        render: Function,
    },
    render: (h, ctx) => {
        console.log(ctx)
        return ctx.props.render.call(ctx.parent, h, ctx.data.attrs)
    },
}
