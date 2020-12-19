
import { unit } from '../../utils/tool'
export default {
    props: {
        vertical: Boolean,
        textPos: {
            type: String,
            // default: 'outside'//inside,inside-center,center,'none'
        },
        percent: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            // validator(value) {
            // 	return oneOf(value, ['default', 'error', 'success']);
            // },
            // default: 'default',
        },
        strokeWidth: {
            type: Number,
            default: 10,
        },
        strokeColor: [String, Array],
        split: Boolean,
        linear: Boolean,
        isInnerColor: Boolean,

    },
    data() {
        return {
            curStatus: this.status,
        }
    },
    created() {
        this.handleStatus();
    },
    computed: {
        showText() {
            return this.textPos != 'none' && !!this.textPos
        },
        showTextInside() {
            return this.textPos == 'inside' || this.textPos == 'inside-center'
        },
        getPercent() {
            return unit(this.percent, "%")
        },
        getStrokeWidth() {
            return unit(this.strokeWidth, "px")
        },
        isFinish() {
            return this.curStatus == 'error' || this.curStatus == 'success';
        },
        getStrokeColor() {
            if (Array.isArray(this.strokeColor)) {
                const unitPercent = this.isInnerColor ? 1 : 100 / this.percent;
                if (this.linear) {
                    return this.strokeColor.map((item) => {
                        return `${item.color} ${item.percent * unitPercent}%`
                    }).join(',');
                }
                if (this.split) {
                    return this.strokeColor.map((item, index) => {
                        let next = this.strokeColor[index + 1];
                        return `${item.color} ${item.percent * unitPercent}%` + (next ? `,${item.color} ${next.percent * unitPercent}%` : `,${item.color} ${unitPercent * 100}%`)
                    }).join(',');
                }
                const data = this.strokeColor.find((item) => {
                    return this.percent < item.percent;
                });
                return (data && data.color);
            }
            return this.strokeColor;
        },

        barStyle() {
            const strokeColor = this.getStrokeColor;
            return this.vertical
                ? {
                    height: `${this.getPercent}`,
                    width: `${this.getStrokeWidth}`,
                    ...(this.split ? {
                        backgroundImage: `linear-gradient(to top,${strokeColor})`,
                        // backgroundSize: '100%'
                    } : {
                            backgroundColor: strokeColor || ''
                        })
                }
                : {
                    width: `${this.getPercent}`,
                    height: `${this.getStrokeWidth}`,
                    ...(this.split ? {
                        backgroundImage: `linear-gradient(to right,${strokeColor})`,
                        // backgroundSize: '100%'
                    } : {
                            backgroundColor: strokeColor || ''
                        })
                };
        },
    },
    methods: {
        handleStatus() {
            let status = 0;
            if (parseInt(this.getPercent, 10) >= 100) {
                this.curStatus = 'success';
                status = 1;
            } else if (this.curStatus === 'error') {
                status = -1;
            } else {
                this.curStatus = 'default';
            }
            this.$emit('on-status-change', status);


        },
    },
    watch: {
        percent() {
            this.handleStatus();
        },
        status(val) {
            this.curStatus = val;
        },
    },
}