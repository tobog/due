
import { ClickOut } from '../../utils/dom';
import Drop from '../base/drop';
export default {
    name: 'Dropdown',
    components: {
        Drop,
    },
    props: {
        trigger: {
            // validator(value) {
            // 	return ['click', 'hover', 'custom'].indexOf(value) > -1;
            // },
            default: 'click'
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        visible: {
            type: Boolean,
            default: false
        },
        transfer: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            show: false,
        };
    },
    beforeCreate() {
		this._ancestor_ = this._cancelClose_=null;
	},
    mounted() {
        this.bindClickOut();
        this.$nextTick(() => {
            this.show = this.visible || false;
        });
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-open`]: this.show
                }
            ]
        }
    },
    watch: {
        visible(val) {
            this.show = val;
        },
    },
    methods: {
        bindClickOut() {
            this.$nextTick(() => {
                const drop = (this.$refs.drop || {}).$el;
                this._eleClickOut = new ClickOut(drop ? [this.$el, drop] : this.$el, (status) => {
                    if (status) this.close();
                });
            })
        },
        handleClick() {
			if (this.trigger !== 'click') return;
			this._ancestor_ && (this._ancestor_._isChildTrigger = true);//可以.stop处理
			this.show = !this.show;
		},
        handleMouseenter() {
            const ancestor = this._ancestor_;
			if (ancestor) ancestor.handleMouseenter();
			if (this.trigger !== 'hover') return;
			clearTimeout(this.__timeout);
			this.show = true;
        },
        handleMouseleave() {
            if (this.trigger === 'hover') this.close();
        },
        close(immediate) {
            clearTimeout(this.__timeout);
            if (this._cancelClose_) return this._cancelClose_ = false;
            if (immediate) return this.show = false;
            this.__timeout = setTimeout(() => {
                this.show = false;
                this.__timeout = null;
            }, 60);
        },
    },
    beforeDestroy() {
        if (this._ancestor_) this._ancestor_.$emit('on-remove-child', this);
		this._eleClickOut && this._eleClickOut.destroy();
		clearTimeout(this.__timeout);
		this.__timeout = null;
    },
}