/**
 *
 */
//  placement: "bottom",
//  gpu: false,
//  offset: 5,
//  positionElement: null,
//  responsive: true,
//  trigger: 'click',
//  always: false,
//  throttle: 140,
//  delay: 0,
 // onchange
 // style
 // gpu
 // callback
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
            default: "custom",
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
