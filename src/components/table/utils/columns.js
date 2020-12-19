
const convertColumnOrder = (columns, layoutFixed) => {
    const left = [], center = [], right = [];
    columns.forEach((column) => {
        if (!column || column.width === 0 || column.width === '0') return;
        if (column.fixed && column.fixed === 'left') {
            left.push(column);
        } else if (column.fixed && column.fixed === 'right') {
            right.push(column);
        } else {
            center.push(column);
        }
    });
    if (layoutFixed) right.reverse();
    return left.concat(center).concat(right);
};

export { convertColumnOrder };

const getAllColumns = (cols, forTableHead = false) => {
    const  result = [];
    cols.forEach((column) => {
        if (!column || column.width === 0 || column.width === '0') return;
        if (column.children) {
            if (forTableHead) result.push(column);
            result.push.apply(result, getAllColumns(column.children, forTableHead));
        } else {
            result.push(column);
        }
    });
    return result;
};

export { getAllColumns };

const convertToRows = (columns, layoutFixed) => {
    let maxLevel = 1;
    const originColumns = convertColumnOrder(columns, layoutFixed),
        traverse = (column, parent) => {
            if (column.width === 0 || column.width === '0') return;
            if (parent) {
                column.level = parent.level + 1;
                if (maxLevel < column.level) {
                    maxLevel = column.level;
                }
            }
            if (column.children) {
                let colSpan = 0;
                column.children.forEach((subColumn) => {
                    traverse(subColumn, column);
                    colSpan += subColumn.colSpan;
                });
                column.colSpan = colSpan;
            } else {
                column.colSpan = 1;
            }
        };

    originColumns.forEach((column) => {
        column.level = 1;
        traverse(column);
    });

    const rows = [];
    for (let i = 0; i < maxLevel; i++) {
        rows.push([]);
    }

    const allColumns = getAllColumns(originColumns, true);

    allColumns.forEach((column) => {
        if (!column.children) {
            column.rowSpan = maxLevel - column.level + 1;
        } else {
            column.rowSpan = 1;
        }
        rows[column.level - 1].push(column);
    });

    return rows;
};

export { convertToRows };