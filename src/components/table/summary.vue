<template>
    <tbody>
        <tr>
            <template v-for="(column, colIndex) in columns">
                <td
                    :key="column.key"
                    :class="cellClasses(column)"
                    :style="handleStyle(column, colIndex)"
                    :data-fixed="column.fixed"
                >
                    {{ data[column.key].value }}
                </td>
            </template>
        </tr>
    </tbody>
</template>

<script>
import { unit } from "../../utils/tool";
export default {
    name: "TableSummary",
    props: {
        columns: Array,
        data: Object, // rebuildData
        prefix: String,
        fixed: String,
        fixedSize: Object,
        layoutFixed: Boolean,
    },

    methods: {
        handleStyle(column, colIndex) {
            if (this.layoutFixed) return;
            const fixedSize = this.fixedSize,
                style = {};
            if (fixedSize) {
                const [width, height] = fixedSize[`${0}/${colIndex}`] || [];
                if (!width || !height) return;
                style.width = style.minWidth = style.maxWidth = unit(width, "px");
                style.height = style.minHeight = unit(height, "px");
                return style;
            }
        },
        cellClasses(column = {}) {
            const _tobogPrefix_ = this.prefix;
            // fixed = this.fixed;
            return [
                // `${_tobogPrefix_}-cell`,
                {
                    [`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
                    [`${_tobogPrefix_}-cell-${column.align}`]: !!column.align,
                },
            ];
        },
    },
    beforeDestroy() {},
};
</script>
