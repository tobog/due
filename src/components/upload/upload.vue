
<template>
	<section :class="wrapClasses" :data-vue-module="$options.name">
		<aside
			tabindex="0"
			:class="[_tobogPrefix_]"
			@click="handleClick"
			@dragover.prevent
			@dragenter.prevent
			@drop.prevent.stop="handleDrop"
		>
			<input
				ref="file"
				type="file"
				:class="[_tobogPrefix_ + '-input']"
				:multiple="multiple"
				:name="name"
				:accept="accept"
				@change="handleChange"
			/>
			<slot
				:percent="totalPercent"
				:speed="totalSpeed"
				:stratUpload="manualUpload"
			></slot>
		</aside>
		<upload-list v-if="showProgress" :data="filesInfo" />
	</section>
</template>

<script>
	import AJAX from "./ajax";
	import uploadList from "./upload-list";
	import FileSilce from "./fileslice";
	import Emitter from "../../utils/emitter";
	export default {
		inheritAttrs: false,
		name: "Upload",
		mixins: [Emitter],
		components: {
			uploadList
		},
		props: {
			name: {
				type: String,
				default: "file"
			},
			action: String,
			manual: {
				type: Boolean,
				default: true
			},
			threads: Number,
			headers: Object,
			params: Object,
			piece: Number,
			draggable: Boolean,
			multiple: Boolean,
			progress: Boolean,
			sync: [Boolean, Number, String],
			format: Array,
			accept: String,
			maxSize: Number,
			beforeUpload: Function
			// defaultfilesInfo: {
			// 	type: Array,
			// 	default() {
			// 		return [];
			// 	}
			// }
		},
		data() {
			return {
				filesInfo: [],
				totalPercent: 0,
				totalSpeed: 0,
				filesSlice: {}
			};
		},
		computed: {
			showProgress() {
				return this.progress && this.filesInfo.length > 0;
			},
			wrapClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					`${_tobogPrefix_}-wrapper`,
					{ [`${_tobogPrefix_}-drag`]: this.draggable }
				];
			},
			getXHR() {
				return this.xhr || this.$attrs.xhr || AJAX;
			}
		},
		// watch: {
		// 	defaultfilesInfo: {
		// 		immediate: true,
		// 		handler(filesInfo = []) {
		// 			this.filesInfo = filesInfo.map(item => {
		// 				item.status = "success";
		// 				item.percent = 100;
		// 				// item.uid = Date.now() + this.tempIndex++;
		// 				return item;
		// 			});
		// 		}
		// 	}
		// },
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
				let postFiles = Array.from(files);
				if (postFiles.length == 0) return;
				postFiles.forEach(file => {
					const uid = (file.uid = file.lastModified + "@" + file.size);
					const isExist = this.filesInfo.some(fileinfo => {
						return fileinfo.uid === uid;
					});
					if (isExist) return;
					this.validateFiles(file);
				});
				postFiles = null;
				this.handleDispatch("on-validate", this.filesInfo);
				if (this.manual) return;
				if (this.sync) {
					const files = this.getWaitFiles().slice(
						0,
						parseInt(this.sync || 1)
					);
					files.forEach(fileInfo => {
						this.post(fileInfo);
					});
				}
			},
			getWaitFiles() {
				return this.filesInfo.filter(fileInfo => fileInfo.status == 0);
			},
			async validateFiles(file) {
				// check format
				const format = this.format || [],
					maxSize = this.maxSize,
					filesInfo = this.filesInfo;
				if (format.length) {
					const _fileFormat = file.name
						.split(".")
						.pop()
						.toLowerCase();
					const checked = format.some(item => {
						const type = item.toLowerCase();
						return type === _fileFormat || type === file.type;
					});
					if (!checked) {
						this.$emit("on-filter-error", file, "format", filesInfo);
						return;
					}
				}
				// check maxSize
				if (maxSize && file.size > maxSize * 1024) {
					this.$emit("on-filter-error", file, "size", filesInfo);
					return;
				}
				const uid = file.uid,
					piece = parseInt(this.piece || 0),
					isFileSlice = piece > 0;
				if (isFileSlice) {
					this.filesSlice[uid] = new FileSilce(
						file,
						{ piece: piece * 1024, threads: this.threads },
						this.fileSliceCallback
					);
					this.filesSlice[uid].slice();
				}
				filesInfo.push({
					uid,
					percent: 0,
					loaded: 0,
					speed: 0,
					status: 0, //ready,uploading,fail,success
					name: file.name,
					size: file.size,
					xhr: null,
					file: isFileSlice ? null : file,
					isFileSlice
				});
				this.$emit("on-change", filesInfo);
			},
			manualUpload(uid) {
				if (uid) {
					const filesInfo = this.filesInfo.find(
						fileInfo => fileInfo.uid === uid
					);
					filesInfo && this.post(filesInfo);
					return;
				}
				this.filesInfo.forEach(fileInfo => this.post(fileInfo));
			},
			nextUpload() {
				if (this.sync) {
					const fileInfo = this.filesInfo.find(
						fileInfo => fileInfo.status == 0
					);
					fileInfo && this.manualUpload(fileInfo.uid);
				}
			},
			fileSliceCallback(type, result, fileChunk, file) {
				const uid = file.uid,
					fileInfo = this.filesInfo.find(fileInfo => fileInfo.uid == uid);
				if (!fileInfo) return;
				if (type == "progress") {
					this.handleSpeed(
						{
							total: fileInfo.size,
							loaded: fileInfo.loaded + result.loaded
						},
						fileInfo
					);
				}
				if (type == "success" && result.isLastChunk) {
					this.handleSuccess(result, fileInfo);
					return;
				}
				if (type == "error") {
					this.handleError(result, fileInfo);
				}
			},
			async post(fileInfo) {
				if (!fileInfo || fileInfo.status > 0) return;
				if (this.beforeUpload) {
					const result = await this.beforeUpload(fileInfo);
					if (!result) {
						this.$emit("cancel", fileInfo);
						return false;
					}
					fileInfo = result;
				}
				fileInfo.status = 1;
				const config = {
						headers: this.headers,
						withCredentials: this.withCredentials,
						data: this.params,
						filename: this.name,
						action: this.action
					},
					XHR = this.getXHR;
				if (fileInfo.isFileSlice) {
					this.filesSlice[fileInfo.uid].upload(XHR, config);
					return;
				}
				const xhr = XHR({
					...config,
					fileInfo,
					onProgress: e => {
						this.handleProgress(e, fileInfo);
					},
					onSuccess: res => {
						this.handleSuccess(res, fileInfo);
					},
					onError: err => {
						this.handleError(err, fileInfo);
					}
				});
				fileInfo.xhr = xhr.then ? await xhr : xhr;
			},
			setTotalSize() {
				let loaded = 0,
					total = 0,
					speed = 0;
				this.filesInfo.forEach(fileInfo => {
					if (fileInfo.status == 1) speed += fileInfo.speed;
					total += fileInfo.size;
					loaded += fileInfo.loaded;
				});
				this.totalSpeed = speed;
				this.totalPercent = parseInt((loaded / total) * 100) || 0;
			},
			handleSpeed(e, fileInfo) {
				if (fileInfo._speeding_) return;
				fileInfo._speeding_ = true;
				const total = e.total,
					loaded = e.loaded;
				let percent = parseFloat((loaded / total) * 100).toFixed(2),
					speed = loaded - fileInfo.loaded;
				if (percent >= 99) percent = 99;
				fileInfo.percent = percent;
				clearTimeout(timeout);
				const timeout = setTimeout(() => {
					const remainTime = (total - loaded) / (speed || 1000);
					fileInfo = Object.assign(fileInfo, {
						speed,
						remainTime,
						loaded
					});
					this.setTotalSize();
					fileInfo._speeding_ = false;
				}, 1200);
			},
			handleProgress(e, fileInfo) {
				this.handleSpeed(e, fileInfo);
				this.$emit("progress", e, fileInfo, this.filesInfo);
			},
			handleSuccess(res, fileInfo) {
				fileInfo = Object.assign(fileInfo, {
					status: 2,
					xhr: null,
					percent: 100,
					speed: 0,
					remainTime: 0,
					file: null
				});
				this.$emit("on-success", res, fileInfo, this.filesInfo);
				this.nextUpload();
			},
			handleError(error, fileInfo) {
				fileInfo = Object.assign(fileInfo, {
					status: -1,
					speed: 0,
					remainTime: 0
				});
				this.$emit("on-error", error, fileInfo, this.filesInfo);
				this.nextUpload();
			},
			handleRemove(fileInfo) {
				const xhr = fileInfo.xhr;
				if (xhr && xhr.abort) xhr.abort();
				if (this.filesSlice[fileInfo.uid])
					this.filesSlice[fileInfo.uid].abort();
				this.filesInfo.splice(this.filesInfo.indexOf(fileInfo), 1);
				delete this.filesSlice[fileInfo.uid];
				this.$emit("on-remove", this.filesInfo);
			},
			handleCancel(fileInfo) {
				const xhr = fileInfo.xhr;
				if (xhr && xhr.abort) xhr.abort();
				if (this.filesSlice[fileInfo.uid])
					this.filesSlice[fileInfo.uid].abort();
				fileInfo = Object.assign(fileInfo, {
					status: -1,
					speed: 0,
					remainTime: 0
				});
				this.$emit("on-cancel", fileInfo, this.filesInfo);
			},
			// handlePreview(fileInfo) {
			// 	if (fileInfo.status == 2)
			// 		this.$emit("on-preview", fileInfo, this.filesInfo);
			// },
			clearFiles() {
				this.filesInfo = [];
				this.filesSlice = {};
				this.totalPercent = this.totalSpeed = 0;
			},
			handleDispatch(...args) {
				if (this.__parentComponent__) {
					this.__parentComponent__.$emit(...args);
				} else {
					this.__parentComponent__ = this.dispatch("FormItem", ...args);
				}
			},
			abort() {
				this.filesInfo.forEach(item => {
					const xhr = item.xhr;
					if (xhr && xhr.abort) xhr.abort();
				});
				Object.keys(this.filesSlice).forEach(key => {
					this.filesSlice[key].abort();
				});
			}
		},
		beforeDestroy() {
			this.abort();
		}
	};
</script>