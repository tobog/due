
<template>
    <section :class="wrapClasses" :data-vview-module='$options.name'>
        <template v-if="custom">
            <slot  :toggle="toggle" :active="isActive"></slot>
        </template>
        <div v-else @click="toggle" :class="_tobogPrefix_+'-header'">
            <Icons v-if="icon" :type="icon"></Icons>
            <slot :active="isActive"></slot>
        </div>
        <vTransition>
            <aside v-show="isActive" :class="_tobogPrefix_+'-content'">
                <slot name="content"></slot>
            </aside>
        </vTransition>
    </section>
</template>

<script>
import Icons from '../icons/index';
import vTransition from '../base/vTransition';
export default {
    name: 'Panel',
    components: {
        Icons,
        vTransition
    },
    props: {
        name: String,
        custom:Boolean,
        icon:{
            type:String,
            default:"ios-arrow-forward"
        }
    },
    data() {
        return {
            isActive: false,
        };
    },
    computed: {
        nameUid() {
            if (this.name === undefined) return this._uid;
            return this.name;
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [_tobogPrefix_, {
                [`${_tobogPrefix_}-active`]: this.isActive
            }];
        },
    },
    methods: {
        toggle() {
            this.$parent.toggle({
                name: this.nameUid,
                isActive: this.isActive
            });
            this.isActive = !this.isActive;
        }
    }
};
</script>
