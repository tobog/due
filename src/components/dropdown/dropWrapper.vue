<template>
	<section
		:class="classes"
		:data-vue-module="$options.name"
		@mouseenter="handleMouseenter"
		@mouseleave="handleMouseleave"
	>
		<div :class="[_tobogPrefix_ + '-ref']" ref="reference" @click="handleClick">
			<slot></slot>
		</div>
		<Drop
			v-show="show"
			ref="drop"
			:class="[_tobogPrefix_ + '-list']"
			:reference="$refs.reference"
			:transfer="transfer||!!_ancestor_"
			:placement="placement"
			@click.native.stop="handleClose"
			@mouseenter.native="handleMouseenter"
			@mouseleave.native="handleMouseleave"
		>
			<slot name="list"></slot>
		</Drop>
	</section>
</template>

<script>
import mixin from './mixin';
export default {
    name: 'DropWrapper',
    mixins: [mixin],
    props: {
        closeMethod: Function
    },
    watch: {
        show(val) {
            this.$emit('on-visible-change', val);
        },
    },
    methods: {
        async handleClose() {
            console.log(this)
            if (typeof this.closeMethod === 'funtion') {
                const bool = await this.closeMethod();
                return bool && this.close(true);
            }
            if (this.trigger === 'custom') return;
            this.close(true);
        },
        close(immediate) {
            clearTimeout(this.__timeout);
            if (this._cancelClose_) return this._cancelClose_ = false;
            if (immediate) return this.show = false;
            this.__timeout = setTimeout(() => {
                this.show = false;
                this.__timeout = null;
            }, 100);
        },
    },
    beforeDestroy() {
        this._eleClickOut && this._eleClickOut.destroy();
        clearTimeout(this.__timeout);
        this.__timeout = null;
    },
};
</script>
