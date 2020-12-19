

<template>
	<keep-alive>
		<transition-group
			:class="_tobogPrefix_"
			name="transition-drop"
			tag="ul"
			appear
			:data-vview-module="$options.name"
		>
			<li v-for="filesInfo in files" :key="filesInfo.uid" :class="fileCls(filesInfo)">
				<span
					:class="_tobogPrefix_ + '-title'"
					@click.native.stop="handlePreview(filesInfo)"
					:title="filesInfo.name"
				>
					<Icons :type="formatFile(filesInfo)" />
					{{filesInfo.name}}
				</span>
				<Icons type="close" @click.native="handleRemove(filesInfo)" />
				<Icons
					v-if="filesInfo.status === 'ready'||filesInfo.status === 'fail'"
					type="pause"
					@click.native="handleManual(filesInfo)"
				/>
				<Icons
					v-if="filesInfo.status === 'uploading'"
					type="play"
					@click.native="handleManual(filesInfo)"
				/>
				<span
					v-show="filesInfo.time&&filesInfo.status === 'uploading'"
				>{{handleProgressText(filesInfo)}}</span>
				<span v-show="filesInfo.status === 'success'">{{langs('complete','已完成')}}</span>
				<span v-show="filesInfo.status === 'fail'">{{langs('fail','失败')}}</span>
				<transition name="transition-drop" appear>
					<Progress
						active
						:stroke-width="8"
						:percent="parsePercent(filesInfo.percent)"
						:status="handleStatus(filesInfo.status)"
					/>
				</transition>
			</li>
		</transition-group>
	</keep-alive>
</template>
<script>
import Progress from '../progress/index';
import Icons from '../icons/index';
import { formatRate, formatTime, formatFile } from './utils';
export default {
	name: 'UploadList',
	components: {
		Progress,
		Icons,
	},
	props: {
		files: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	methods: {
		formatRate,
		formatTime,
		formatFile,
		langs(key, defaultVal, val = {}) {
			if (typeof this.$t !== 'function') return defaultVal;
			key = `${this.__$langPrefix__}.upload.${key}`;
			key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
			const value = this.$t(key, val)
			return key === value ? defaultVal : value;
		},
		fileCls(filesInfo) {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-file`,
				{
					[`${_tobogPrefix_}-file-error`]: filesInfo.status === 'fail',
					[`${_tobogPrefix_}-file-uploading`]: filesInfo.status === 'uploading',
				},
			];
		},
		handleManual(filesInfo) {
			if (filesInfo.status === 'ready' || filesInfo.status === 'fail') this.$emit('on-file-manual', filesInfo);
		},
		handlePreview(filesInfo) {
			this.$emit('on-file-preview', filesInfo);
		},
		handleRemove(filesInfo) {
			this.$emit('on-file-remove', filesInfo);
		},
		handleStatus(status) {
			if (status === 'success') {
				return 'success';
			}
			if (status === 'fail') {
				return 'wrong';
			}
			return 'default';
		},
		parsePercent(val) {
			return parseInt(val || 0, 10);
		},
		handleProgressText(filesInfo) {
			let { speed, size, time } = filesInfo;
			time = this.formatTime(time);
			speed = this.formatRate(speed);
			size = this.formatRate(size);
			return `${speed}/s - ${size} ${this.langs('residue', '剩余')}${time}`
		},
	},
};
</script>