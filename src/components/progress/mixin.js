
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
        strokeColor: Array

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
            const strokeColor = this.strokeColor;
            if (Array.isArray(strokeColor)) {
                return strokeColor.map((item) => {
                    return Array.isArray(item) ? item.join(" ") : item;
                }).join(',')
            }
        },
        barStyle() {
            const linearColor = this.getStrokeColor;
            return this.vertical
                ? {
                    height: `${this.getPercent}`,
                    width: `${this.getStrokeWidth}`,
                    backgroundImage: linearColor ? `linear-gradient(to top,${linearColor})` : ''
                }
                : {
                    width: `${this.getPercent}`,
                    height: `${this.getStrokeWidth}`,
                    backgroundImage: linearColor ? `linear-gradient(to right,${linearColor})` : ''
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