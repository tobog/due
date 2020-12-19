import { validVal } from "../utils/tool";

export default {
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        dataType: {
            type: String,
            default: "tree" //list,map,tree
        },
        identifier: {
            type: String,
            default: "id"
        },
        parentId: {
            type: String,
            default: "parentId"
        },
    },
    data() {
        return {
            nodeList: [],
            rootNode: {
                childIds: [],
                childIndexs: []
            },
        }
    },
    created() {
        this.initData();
    },
    computed: {
        getRootNodeList() {
            return this.getChildren(this.rootNode.childIndexs);
        },
    },
    methods: {
        initData() {
            const headNodeList = this.getHeadNodes();
            this.nodeList = this.handleNodeList(
                headNodeList
            );
            this.rootNode = this.initRootNode(headNodeList.length);
        },
        initRootNode(length) {
            const identifier = this.identifier || "id";
            const childIds = [],
                childIndexs = [];
            this.nodeList.slice(0, length).forEach(node => {
                childIds.push(node.data[identifier]);
                childIndexs.push(node.index);
            });
            return {
                childIds,
                childIndexs
            };
        },
        getHeadNodes() {
            if (this.dataType === "tree") return this.data;
            const identifier = this.identifier || "id",
                parentIdKey = this.parentId || "parentId",
                isRootNode = function (parentId) {
                    return !this.data.some(item => {
                        const id = item[identifier];
                        return validVal(id) && id == parentId;
                    });
                };
            return this.data.filter(node => {
                const parentId = node[parentIdKey];
                if (!validVal(parentId) || isRootNode(parentId)) return true;
                return false;
            });
        },
        // 生成内部状态节点
        handleNodeList(headNodeList = [], nodeList = [], data, parent) {
            let _length = nodeList.length,
                sourceData = data || this.data;
            const list = nodeList,
                identifier = this.identifier || "id",
                parentIdKey = this.parentId || "parentId",
                getAllChild = id => {
                    let _sourceData = [];
                    let children = sourceData.filter(node => {
                        const parentId = node[parentIdKey];
                        if (!validVal(parentId)) return false;
                        if (parentId == id) return true;
                        _sourceData.push(node[identifier]);
                        return false;
                    });
                    sourceData = _sourceData;
                    return children;
                },
                iteratorNode = (data, parent) => {
                    const childrenList = [];
                    data.forEach((node, index) => {
                        const data = { ...node },
                            id = data[identifier],
                            _index = _length++,
                            obj = { data, index: _index, sortIndex: index };
                        list[_index] = obj;
                        if (parent) {
                            obj.parent = parent.index;
                            obj.linkIndex = `${parent.linkIndex},${index}`;
                            parent.childIds.push(id);
                            parent.childIndexs.push(_index);
                        } else {
                            obj.linkIndex = `${index}`;
                        }
                        const children = data.children
                            ? data.children
                            : validVal(id) && getAllChild(id);
                        if (children && children.length) {
                            obj.childIds = [];
                            obj.childIndexs = [];
                            data.children = null;
                            childrenList.push([children, obj]);
                            // iteratorNode(children, obj);
                        }
                    });
                    childrenList.forEach(([data, parent]) => {
                        iteratorNode(data, parent);
                    });
                };
            iteratorNode(headNodeList, parent);
            return list;
        },
        asyncNodeList(children, parent, data = this.data) {
            if (!Array.isArray(parent.childIds)) parent.childIds = [];
            if (!Array.isArray(parent.childIndexs)) parent.childIndexs = [];
            if (!children) children = data.children;
            data.children = null;
            return this.handleNodeList(children, this.nodeList, data, parent);
        },
        getChildren(indexs = []) {
            return indexs.map(index => {
                return this.nodeList[index];
            });
        },
    },


}