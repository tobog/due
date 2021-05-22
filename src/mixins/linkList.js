import { typeOf, validVal } from "../utils/tool";
// nodeList 数据结构设计
// {
//     childIds: [] 子元素id
//     childIndexs: [] 在list 中的位置
//     data: {} 原始数据
//     index: 0， 在list 中的位置
//     linkIndex: "0", 树节点位置
//     linkParentIndex: ""， 父级树节点位置
//     sortIndex: 0， 顺序位置
// }
export default {
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        identifier: {
            type: String,
            default: "id",
        },
        parentKey: {
            type: String,
            default: "parentId",
        },
        selection: {
            type: String,
            // default: "single", //multiple,single,无
        },
    },
    data() {
        return {
            nodeList: [],
            rootData: {
                childIds: [],
                childIndexs: [],
            },
        };
    },
    computed: {
        getRootNodeList() {
            return this.getChildren(this.rootData.childIndexs);
        },
    },
    methods: {
        initStatusData(nodeList) {
            if (this.selection === "multiple") {
                const len = nodeList.length;
                for (let i = len; i--; i > -1) {
                    if (!nodeList[i].childIndexs || !nodeList[i].childIndexs.length) {
                        this.updateUpTree(nodeList[i]);
                    }
                }
            }
        },
        initData(data = this.data) {
            const rootNodes = this.getRootNodes(data);
            this.nodeList = this.handleNodeList(rootNodes);
            this.rootData = this.getRootData(rootNodes.length);
            console.log(this.nodeList, this.rootData, "-------------");
        },
        /**
         * 获取根数据
         * @param {} length
         */
        getRootData(length) {
            const identifier = this.identifier,
                childIds = [],
                childIndexs = [];
            this.nodeList.slice(0, length).forEach((node) => {
                childIds.push(node.data[identifier]);
                childIndexs.push(node.index);
            });
            return {
                childIds,
                childIndexs,
            };
        },
        /**
         * 获取根节点
         * @param {*} data 源数据
         */
        getRootNodes(data = this.data) {
            const type = typeOf(data),
                identifier = this.identifier,
                parentKey = this.parentKey;
            // 原始数据类型
            if (type === "array") {
                // 是数据结构
                if (data.some((node) => node && Array.isArray(node.children))) return data;
                const isRootNode = (parentId) => {
                    return !data.some((item) => validVal(item[identifier]) && item[identifier] === parentId);
                };
                return data.filter((node) => {
                    return !validVal(node[parentKey]) || isRootNode(node[parentKey]);
                });
            }
            if (type === "object") {
                let result = [];
                Object.keys(data).forEach((key) => {
                    const item = data[key];
                    if (!validVal(item[parentKey]) || !validVal(data[item[parentKey]])) {
                        // item[identifier] = item[identifier] || key;
                        result.push(item);
                    }
                });
                return result;
            }
            return [];
        },
        /**
         * 生成内部状态节点，和数据平面化
         * @param {*} rootNodeList 根节点
         * @param {*} nodeList 已有的节点
         * @param {*} data 源数据
         * @param {*} parent 父节点
         */
        handleNodeList(rootNodeList = [], nodeList = [], data, parent) {
            let _length = nodeList.length,
                sourceData = data || this.data;
            const list = nodeList,
                // 性能优化，减少搜索
                getAllChild = (id) => {
                    let _sourceData = [];
                    let children = sourceData.filter((node) => {
                        const parentId = node[this.parentKey];
                        if (!validVal(parentId)) return false;
                        if (parentId === id) return true;
                        _sourceData.push(node[this.identifier]);
                        return false;
                    });
                    sourceData = _sourceData;
                    return children;
                },
                iteratorNode = (data, parent) => {
                    let childrenList = [];
                    data.forEach((node, index) => {
                        const data = { ...node },
                            id = data[this.identifier],
                            _index = _length++,
                            obj = { data, index: _index, sortIndex: index };
                        list[_index] = obj;
                        if (parent) {
                            obj.parent = parent.index;
                            // 在平铺数组的位置
                            obj.linkParentIndex = parent.linkParentIndex
                                ? `${parent.linkParentIndex},${parent.index}`
                                : `${parent.index}`;
                            // 树结构层级
                            obj.linkIndex = `${parent.linkIndex},${index}`;
                            parent.childIds.push(id);
                            parent.childIndexs.push(_index);
                        } else {
                            obj.linkIndex = `${index}`;
                            obj.linkParentIndex = "";
                        }
                        const children = data.children ? data.children : validVal(id) && getAllChild(id);
                        if (children && children.length) {
                            obj.childIds = [];
                            obj.childIndexs = [];
                            // 清空原始数据
                            data.children = null;
                            childrenList.push([children, obj]);
                        }
                    });
                    childrenList.forEach(([data, parent]) => {
                        iteratorNode(data, parent);
                    });
                };
            iteratorNode(rootNodeList, parent);
            return list;
        },
        /**
         * 通过index 直接获取数据
         * @param {*} indexs
         */
        getChildren(indexs = [], data = this.nodeList) {
            return indexs.map((index) => {
                return data[index];
            });
        },
        /**
         * 是否有子节点
         * @param {*} data
         */
        hasChildren(data) {
            return data && data.childIndexs && data.childIndexs.length > 0;
        },
        /**
         * 异步添加数据
         * @param {*} children
         * @param {*} parent 加入到的父节点
         * @param {*} data  备选源数据
         */
        asyncAddNodeList(children, parent, data = this.data) {
            children = children || data.children;
            if (!Array.isArray(parent.childIds)) parent.childIds = [];
            if (!Array.isArray(parent.childIndexs)) parent.childIndexs = [];
            data.children = null;
            return this.handleNodeList(children, this.nodeList, data, parent);
        },
        /**
         *向上更新状态
         * @param {*} node
         * @param {*} loop
         */
        updateUpTree(node, loop = false) {
            if (!node) return;
            if (!validVal(node.parent)) return;
            const parent = this.nodeList[node.parent],
                parentData = parent.data,
                selectSelf = this.getSelectOnlySelf(parentData.selectSelf),
                data = node.data;
            if (!selectSelf) {
                if (data.selected) {
                    const isAll = parent.childIndexs.every((index) => this.nodeList[index].data.selected);
                    this.$set(parentData, "selected", isAll);
                    this.$set(parentData, "indeterminate", !isAll);
                } else {
                    this.$set(parentData, "selected", false);
                    this.$set(
                        parentData,
                        "indeterminate",
                        parent.childIndexs.some((index) => {
                            const { selected, indeterminate } = this.nodeList[index].data;
                            return selected || indeterminate;
                        })
                    );
                }
            }
            if (loop) this.updateUpTree(parent, true);
        },
        /**
         * 向下更新状态
         * @param {*} node
         * @param {*} changes
         */
        updateDownTree(node, changes = {}) {
            for (let key in changes) {
                this.$set(node.data, key, changes[key]);
            }
            if (node.childIndexs && node.childIndexs.length) {
                node.childIndexs.forEach((index) => {
                    this.updateDownTree(this.nodeList[index], changes);
                });
            }
        },
        /**
         * 是否仅仅自己
         * @param {*} selectSelf
         */
        getSelectOnlySelf(selectSelf) {
            return selectSelf == void 0 || selectSelf === "" ? this.selectSelf : selectSelf;
        },
        /**
         * 获取所有最后选择数据
         */
        getSelectedData() {
            let result = [],
                linkIndexs = [];
            for (let index = this.nodeList.length - 1; index >= 0; index--) {
                const node = this.nodeList[index];
                if (node.data.selected) {
                    if (!linkIndexs.some((item) => item.indexOf(node.linkIndex) === 0)) {
                        result.push(this.nodeList[node.index]);
                    }
                    linkIndexs.push(node.linkIndex);
                }
            }
            return result;
        },
        /**
         *通过value 获取结构数据
         * @param {*} value
         */
        getDataByValue(value, valueKey = 'value') {
            const findData = (value) => {
                return this.nodeList.find((node) => node.data[valueKey] === value);
            };
            return value.map((item) => {
                return this.selection === "multiple" ? item.map(findData) : findData(item);
            });
        },
        /**
         *通过label 获取结构数据
         * @param {Array} labels
         * @return {Array}
         */
        getDataByLabel(labels = [], valueKey = 'value', labelKey = 'label') {
            const findData = (label) => {
                return this.nodeList.find((node) => `${node.data[labelKey] || node.data[valueKey]}`.indexOf(label) > -1);
            };
            let data = labels.map((label) => findData(label.trim())).filter((value) => !!value);
            data = data[data.length - 1];
            if (data) {
                let linkParentIndexs = data.linkParentIndex
                    ? (data.linkParentIndex + "," + data.index).split(",")
                    : [data.index];
                return linkParentIndexs.map((index) => this.nodeList[index]);
            }
            return [];
        },
        /**
         *通过label 获取平铺后数据list
         * @param {Array} labels
         */
        getFlatDataByLabel(labels, valueKey ="value", labelKey = 'label') {
            if (!labels || !labels.length) return [];
            console.log(labels);
            labels = labels.map((item) => item.trim()).join("/");
            let result = [];
            this.nodeList.forEach((item) => {
                if (!item.childIndexs || !item.childIndexs.length) {
                    let linkParentIndexs = item.linkParentIndex
                        ? (item.linkParentIndex + "," + item.index).split(",")
                        : [item.index];
                    let str = "";
                    let linkData = linkParentIndexs.map((index) => {
                        let node = this.nodeList[index];
                        str = str + (node.data[labelKey] || node.data[valueKey]) + "/";
                        return node;
                    });
                    if (str.indexOf(labels) > -1) result.push(linkData);
                }
            });
            return result;
        },
    },
};
