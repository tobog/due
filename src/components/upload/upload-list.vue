

<template>
	<transition-group
		:class="[_tobogPrefix_]"
		name="transition-drop"
		tag="ul"
		appear
		:data-vue-module="$options.name"
	>
		<li v-for="fileInfo in data" :key="fileInfo.uid" :class="fileCls(fileInfo)">
			<div :class="[_tobogPrefix_ + '-content',_tobogPrefix_ + '-status']">
				<span :class="[_tobogPrefix_ + '-title']" :title="fileInfo.name">
					<Icons :type="formatFile(fileInfo.name)" center size="1.2em" />
					{{fileInfo.name}}
				</span>
				<span :class="[_tobogPrefix_ + '-data']">
					<span v-show="fileInfo.remainTime&&fileInfo.status ==1">{{handleProgressText(fileInfo)}}</span>
					<span v-show="fileInfo.status ==2">{{langs('upload.complete','已完成')}}</span>
					<span v-show="fileInfo.status ==-1">{{langs('upload.fail','失败')}}</span>
				</span>
			</div>
			<div :class="[_tobogPrefix_ + '-content']">
				<Progress
					active
					:class="[_tobogPrefix_ + '-bar']"
					:percent="fileInfo.percent"
					:status="handleStatus(fileInfo.status)"
				/>
				<Icons v-if="fileInfo.status==1" type="pause" @click.native="handleCancel(fileInfo)" />
				<Icons v-if="fileInfo.status <1" type="play" @click.native="handleManual(fileInfo)" />
				<Icons type="close" @click.native="handleRemove(fileInfo)" />
			</div>
		</li>
	</transition-group>
</template>
<script>
import Progress from '../progress/index';
import Icons from '../icons/src/index';
import { formatRate, formatTime, formatFile } from './utils';
import langMinix from '../../mixins/lang'
export default {
	name: 'UploadList',
	mixins: [langMinix],
	components: {
		Progress,
		Icons,
	},
	props: {
		data: {
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
		fileCls(fileInfo) {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-file`,
				{
					[`${_tobogPrefix_}-file-error`]: fileInfo.status === 'fail',
					[`${_tobogPrefix_}-file-uploading`]: fileInfo.status === 'uploading',
				},
			];
		},
		handleManual(fileInfo) {
			if (fileInfo.status < 1) this.$parent.manualUpload(fileInfo.uid);
		},
		// handlePreview(fileInfo) {
		// 	this.$parent.handlePreview(fileInfo);
		// },
		handleCancel(fileInfo) {
			this.$parent.handleCancel(fileInfo);
		},
		handleRemove(fileInfo) {
			this.$parent.handleRemove(fileInfo);
		},
		handleStatus(status) {
			if (status == 2) return 'success';
			if (status == -1) return 'error';
			return 'default';
		},
		handleProgressText(fileInfo) {
			let { speed, size, remainTime, percent = 0 } = fileInfo;
			remainTime = this.formatTime(remainTime);
			speed = this.formatRate(speed);
			size = this.formatRate(size);
			return `${speed}/s - ${percent}%/${size} - ${this.langs('upload.residue', '剩余')} ${remainTime}`
		},
	},
};
</script>