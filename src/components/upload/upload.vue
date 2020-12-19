
<template>
	<section :class="_tobogPrefix_+'-outer'" :data-vview-module="$options.name">
		<aside tabindex="0" :class="wrapClasses" @click="handleClick" @drop.prevent.stop="handleDrop">
			<input
				ref="file"
				type="file"
				style="display:none"
				@change="handleChange"
				:multiple="multiple"
				:name="name"
				:accept="accept"
			>
			<slot :percent="totalPercent" :speed="totalSpeed" :stratUpload="handleUpload"></slot>
		</aside>
		<slot name="tip"></slot>
		<upload-list
			v-if="showProgress"
			:files="filesInfo"
			@on-file-remove="handleRemove"
			@on-file-manual="handleUpload"
			@on-file-preview="handlePreview"
		/>
		<slot name="footer" :percent="totalPercent" :speed="totalSpeed" :stratUpload="handleUpload"></slot>
	</section>
</template>

<script>
import AJAX from './ajax';
import uploadList from './upload-list';
import Emitter from '../../utils/emitter';
import { typeOf } from '../../utils/tool';

export default {
	inheritAttrs: false,
	name: 'Upload',
	mixins: [Emitter],
	components: {
		uploadList,
	},
	props: {
		name: {
			type: String,
			default: 'file',
		},
		action: {
			type: String,
			required: true,
		},
		manual: {
			type: Boolean,
			default: true
		},
		headers: Object,
		params: Object,
		draggable: Boolean,
		multiple: Boolean,
		progress: Boolean,
		sync: [Boolean, Number, String],
		format: Array,
		accept: String,
		maxSize: [Number, String],
		beforeUpload: Function,
		defaultfilesInfo: {
			type: Array,
			default() {
				return [];
			},
		},
	},

	data() {
		return {
			filesInfo: [],
			filesData: {},
			tempIndex: 1,
			totalPercent: 0,
			totalSpeed: 0,
		};
	},
	computed: {
		showProgress() {
			return this.progress && this.filesInfo.length > 0
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [_tobogPrefix_, { [`${_tobogPrefix_}-drag`]: this.draggable }];
		},
		getXHR() {
			return this.xhr || this.$attrs.xhr || AJAX;
		},
	},
	watch: {
		defaultfilesInfo: {
			immediate: true,
			handler(filesInfo) {
				this.filesInfo = filesInfo.map(item => {
					item.status = 'success';
					item.percent = 100;
					item.uid = Date.now() + this.tempIndex++;
					return item;
				});
			},
		},
	},
	methods: {
		handleClick() {
			this.$refs.file.click();
		},
		handleChange(e) {
			const files = e.target.files;
			if (!files || files.length == 0) return;
			this.uploadFiles(files);
			this.$refs.file.value = null;
		},
		handleDrop(e) {
			if (!this.draggable) return;
			this.uploadFiles(e.dataTransfer.files);
		},
		uploadFiles(files) {
			let sync = this.sync, manual = this.manual, postFiles = Array.from(files);
			this.handleDispatch('on-validate', postFiles);
			if (postFiles.length == 0) return;
			postFiles.forEach(file => {
				const isExist = this.filesInfo.some((fileinfo) => {
					return fileinfo.name === file.name && file.size === fileinfo.size;
				});
				if (!isExist && this.validateFiles(file) && !manual && !sync) this.post(file);
			});
			if (sync && !manual) {
				const files = postFiles.slice(0, Number(sync, 10));
				files.forEach(file => {
					this.post(file);
				});
			}
		},
		manualUpload(uid) {
			if (uid) {
				this.post(this.filesData[uid]);
			} else {
				this.filesInfo.forEach(file => {
					this.post(this.filesData[file.uid]);
				});
			}
		},
		nextUpload(file) {
			if (this.sync) {
				const filesInfo = this.filesInfo;
				file = filesInfo[filesInfo.indexOf(file) + 1];
				if (!file) return;
				if (file.status === 'ready') {
					this.manualUpload(file.uid);
				} else {
					this.nextUpload(file);
				}
			}
		},
		validateFiles(file) {
			// check format
			const format = this.format || [],
				maxSize = this.maxSize,
				filesInfo = this.filesInfo;
			if (format.length) {
				const _fileFormat = file.name.split('.').pop().toLowerCase();
				const checked = format.some(item => {
					const type = item.toLowerCase();
					return type === _fileFormat || type === file.type;
				});
				if (!checked) {
					this.$emit('on-filter-error', file, 'format', filesInfo);
					return false;
				}
			}
			// check maxSize
			if (maxSize) {
				if (file.size > maxSize * 1024) {
					this.$emit('on-filter-error', file, 'size', filesInfo);
					return false;
				}
			}

			let uid = Date.now() + this.tempIndex++;
			file.uid = uid;
			filesInfo.push({
				uid,
				percent: 0,
				status: 'ready',//ready,uploading,fail,success
				name: file.name,
				size: file.size,
				manual: this.manual,
				speedStatus: true,
				xhr: null,
			});
			this.filesData[uid] = file;
			this.$emit('on-change', filesInfo, file);
			return true;
		},
		getFileInfo(file) {
			return this.filesInfo.find(item => {
				return file.uid === item.uid;
			});
		},
		async post(file) {
			if (!file) return;
			if (this.beforeUpload) {
				const before = this.beforeUpload(file);
				if (before && before.then) {
					before.then(processedFile => {
						if (typeOf(processedFile) === 'file') {
							file = processedFile;
						}
					});
				} else if (before === false) {
					this.$emit('cancel', file);
					return false;
				}
			}
			const fileInfo = this.getFileInfo(file);
			if (!fileInfo || fileInfo.status === 'success' || fileInfo.status === 'uploading') return;
			fileInfo.status = 'uploading';
			const xhr = this.getXHR({
				headers: this.headers,
				withCredentials: this.withCredentials,
				data: this.params,
				filename: this.name,
				action: this.action,
				file,
				fileInfo,
				onProgress: e => {
					this.handleProgress(e, fileInfo);
				},
				onSuccess: res => {
					this.handleSuccess(res, fileInfo);
				},
				onError: err => {
					this.handleError(err, fileInfo);
				},
			});
			fileInfo.xhr = (xhr.then) ? await xhr : xhr;
		},
		handleTotalData() {
			let loaded = 0, total = 0, speed = 0;
			this.filesInfo.forEach(file => {
				if (file.status !== 'success' && file.status !== 'fail') {
					speed += file.speed || 0;
				}
				total += file.size || 0;
				loaded += file.loaded || 0;
			});
			this.totalSpeed = speed;
			this.totalPercent = parseInt(loaded / total * 100) || 0;
		},
		handleSpeed(e, fileInfo) {
			if (!fileInfo.speedStatus) return;
			const total = e.total,
				loaded = e.loaded;
			let percent = total > 0 ? loaded / total * 100 : 0, speed = (percent - fileInfo.percent) * total / 100;
			if (percent >= 99) percent = 99;
			fileInfo.speedStatus = false;
			fileInfo.percent = percent;
			let timeout = setTimeout(() => {
				clearTimeout(timeout);
				let time = (total - loaded) / (speed || 1000);
				fileInfo = Object.assign(fileInfo, { speedStatus: true, speed, time, loaded });
				this.handleTotalData();
			}, 1000);
		},
		handleProgress(e, fileInfo) {
			this.handleSpeed(e, fileInfo);
			this.$emit('progress', e, fileInfo, this.filesInfo);
		},
		handleSuccess(res, fileInfo) {
			fileInfo = Object.assign(fileInfo, {
				status: 'success',
				xhr: null,
				percent: 100,
				speed: 0,
				time: 0,
			});
			delete this.filesData[fileInfo.uid];
			this.nextUpload(fileInfo);
			this.$emit('on-success', res, fileInfo, this.filesInfo);
		},
		handleError(error, fileInfo) {
			fileInfo = Object.assign(fileInfo, { status: 'fail', speed: 0, time: 0, });
			this.nextUpload(fileInfo);
			this.$emit('on-error', error, fileInfo, this.filesInfo);
		},
		handleUpload(fileInfo) {
			this.manualUpload(fileInfo.uid);
		},
		handleRemove(fileInfo) {
			const filesInfo = this.filesInfo;
			const xhr = fileInfo.xhr || {};
			if (xhr.abort) xhr.abort();
			filesInfo.splice(filesInfo.indexOf(fileInfo), 1);
			delete this.filesData[fileInfo.uid];
			this.$emit('on-remove', fileInfo, this.filesInfo);
		},
		handlePreview(fileInfo) {
			if (fileInfo.status === 'success') this.$emit('on-preview', fileInfo, this.filesInfo);
		},
		clearFiles() {
			this.filesInfo = [];
			this.filesData = {};
			this.totalPercent = this.totalSpeed = 0;
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},
	},

};
</script>