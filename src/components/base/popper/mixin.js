/**
 *
 */

export default {
    props: {
        transfer: Boolean,
        reference: [String, HTMLElement],
        placement: String, //top,left,bottom,right,center,fix
        transitionName: String,
        content: String,
        delay: [Number, String],
        gpu: Boolean,
        trigger: {
            type: String,
            default: "other",
        }, //click hover,other,
        always: Boolean,
        offset: {
            type: [String, Number],
            default: 5,
        },
        showArrow: {
            type: Boolean,
            default: void 0,
        },
        responsive: {
            type: Boolean,
            default: void 0,
        },
    },
};
