export default {
    name: 'RenderCell',
    functional: true,
    props: {
        render: Function
    },
    render: (h, ctx) => {
        console.log(ctx)
        return h('div','testtttttttt')
    }
};