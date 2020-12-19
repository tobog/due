
// import md5 from '../../utils/md5'
// export async function Md5File(file) {
//     if (file.length > 1000) file = file.slice(0, 1000);
//     return new Promise((reslove, reject) => {
//         const reader = new FileReader();
//         reader.readAsBinaryString(file)
//         reader.onload = function () {
//             reslove(Md5.hex_md5(this.result))
//         }
//         reader.onerror = function () {
//             reject()
//         }
//     })
// }

export default class FileSilce {
    constructor(file, options, callback) {
        if (typeof options === 'function') {
            this._callback = options;
            options = {}
        } else if (typeof callback === 'function') {
            this._callback = callback;
        }
        this._options = {
            piece: 1024 * 1024 * 1,
            store: null,
            record: false,
            threads: 3,
            ...options
        }
        this.file = file;
        this._fileChunks = [];
    }
    slice(file) {
        file = file || this.file;
        if (!(file instanceof File)) {
            throw "file is File";
        }
        const uid = this._uid = file.uid;
        const { piece } = this._options;
        const totalSize = file.size,
            chunks = [];
        let start = 0,
            end = start + piece;
        while (start < totalSize) {
            let blob = file.slice(start, end);
            chunks.push(blob)
            start = end;
            end = start + piece;
        }
        this._file = {
            name: file.name,
            size: totalSize,
            length: chunks.length,
            chunks,
            loaded: 0,
            uid,
        };
        file = this.file = null;
        this.fileChunks();
    }
    fileChunks() {
        const { name, length, chunks } = this._file;
        this._fileChunks = chunks.map((chunk, index) => {
            return {
                name,
                length,
                size: chunk.length,
                file: chunk,
                chunk: index,
                status: 0,//0:未初始化,1:正在处理,2：成功,-1：失败
            }
        })
        return this
    }
    getNext(index) {
        let fileChunk
        if (parseInt(index) > -1) {
            fileChunk = this._fileChunks[index]
        } else {
            fileChunk = this._fileChunks.find(fileChunk => fileChunk.status == 0)
        }
        return fileChunk;
    }
    upload(request, config) {
        this.abort();
        this._request = request;
        this._config = config || {};
        this.isAbort = false;
        const threads = this.threads || 3;
        for (let index = 0; index < threads; index++) {
            this.chunkUpload(request, config)
        }
    }
    async chunkUpload(request, config) {
        if (this.isAbort) return;
        const fileChunk = this.getNext();
        if (!fileChunk) return;
        const isLastChunk = this._isLastChunk(),
            _hasPendingChunk = this._hasPendingChunk().length;
        if (isLastChunk && _hasPendingChunk) return;
        fileChunk.status = 1;
        request = request || this._request;
        config = config || this._config;
        const isOver = !_hasPendingChunk && isLastChunk;
        const xhr = request({
            ...config,
            isLastChunk: isOver,
            fileInfo: fileChunk,
            onProgress: async (e) => {
                await this._callback('progress', e, fileChunk, this._file);
            },
            onSuccess: async (res) => {
                fileChunk.status = 2;
                fileChunk.chunk = fileChunk.xhr = null;
                // this._file.loaded = this.getLoadedSize();
                if (isOver && this._fileChunks.some(fileChunk => fileChunk.status == 2)) {
                    return await this._callback('error', res, fileChunk, this._file);
                }
                await this._callback('success', { isLastChunk: isOver }, fileChunk, this._file);
                if (!isOver) this.chunkUpload();
            },
            onError: async (err) => {
                fileChunk.status = -1;
                fileChunk.xhr = null;
                if (isOver) return await this._callback('error', err, fileChunk, this._file);
                this.chunkUpload();
            },
        })
        fileChunk.xhr = (xhr.then) ? await xhr : xhr;
    }
    reset() {
        this._fileChunks.forEach(fileChunk => {
            if (fileChunk.status == -1) fileChunk.status == 0;
        })
    }
    getLoadedSize() {
        return this._fileChunks.reduce((total, fileChunk) => {
            return fileChunk.status == 2 ? total + fileChunk.size : total
        }, 0)
    }
    abort() {
        this.isAbort = true;
        this._fileChunks.forEach(fileChunk => {
            const xhr = fileChunk.xhr;
            if (xhr && xhr.abort) xhr.abort();
            if (fileChunk.status != 2) fileChunk.status = 0;
        })
    }
    _hasPendingChunk() {
        return this._fileChunks.filter(fileChunk => {
            return fileChunk.status == 1;
        });
    }
    _isLastChunk() {
        const waitChunk = this._fileChunks.filter(fileChunk => {
            return fileChunk.status == 0;
        });
        return waitChunk.length == 1
    }
    // async _handleSuccess(res, fileChunk) {
    //     fileChunk.status = 2;
    //     fileChunk.chunk = fileChunk.xhr = null;
    //     // this._file.loaded = this.getLoadedSize();
    //     this._callback('success', res, fileChunk, this._file);
    //     this.chunkUpload();
    // }


    // set(index = 0, options = {}) {
    //     this._fileChunks[index] = { ...this._fileChunks[index], ...options };
    // }
    // saveStore(name) {
    //     // const store = this.store, file = this._file, md5s = [];
    //     // this._fileChunks.forEach(fileChunk => {
    //     //     if (fileChunk.status == 2) md5s.push(fileChunk.md5)
    //     // })
    //     // store.save(name, {
    //     //     ...this._file,
    //     //     chunks: undefined,
    //     //     md5s,
    //     // })
    // }
    // getStore(name) {
    //     // const { file, md5s } = store.get(name);
    //     // this.file = file;
    //     // this.slice();
    //     // this.fileChunks();
    //     // this._fileChunks.forEach(fileChunk => {
    //     //     if (md5s.indexOf(fileChunk.md5) > -1) fileChunk.status = 2;
    //     // })
    // }
}


// async function IndexDB(databaseName) {
//     return new Promise((resolve, reject) => {
//         if (!window.indexedDB) return reject('不支持');
//         let request = window.indexedDB.open(databaseName);
//         request.onerror = function (event) {
//             console.log('数据库打开报错');
//             reject("数据库打开报错")
//         }
//         let getDB = function (event) {
//             console.log('数据库打开成功');
//             resolve(event.target.result)
//         }
//         request.onsuccess = request.onupgradeneeded = getDB
//     })
// }
// IndexDB.save = function (db, storeName) {
//     var objectStore;
//     if (!db.objectStoreNames.contains(storeName)) {
//         objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
//     }
// }
