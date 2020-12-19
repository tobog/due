export default {
    functional: true,
    render(h, ctx) {
        const data = ctx.data,
            dataAttrs = data.attrs,
            tag = dataAttrs.tag;
        if (!tag) return;
        let children = dataAttrs.children ? dataAttrs.children : ctx.children;
        if (typeof children === "function") children = children.call(ctx.parent, h);
        const scopedSlots={ ...dataAttrs.scopedSlots },
            on={ ...dataAttrs.on,...data.on },
            domProps={ ...dataAttrs.domProps,...data.domProps },
            nativeOn={ ...dataAttrs.nativeOn,...data.nativeOn },
            attrs={ ...dataAttrs.attrs,...dataAttrs.props,tag:null,children:null,scopedSlots:null,on:null,domProps:null,nativeOn:null};
        return h(
            tag,
            {
                ...data,
                attrs,
                scopedSlots,
                on,
                domProps,
                nativeOn
            },
            [children]
        );
    }
};
