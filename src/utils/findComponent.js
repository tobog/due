// Find components upward
export function findComponentUpward(context, componentNames) {
    if (!(componentNames instanceof Array)) componentNames = [componentNames];
    let parent = context.$parent,
        name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) == -1)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}

// Find component downward
export function findComponentDownward(context, componentName) {
    const childrens = context.$children;
    let children = null;
    if (childrens.length) {
        for (const child of childrens) {
            if (child.$options.name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}

// Find components downward
export function findComponentsDownward(context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentsDownward(child, componentName);
        return components.concat(foundChilds);
    }, []);
}

// Find components upward
export function findComponentsUpward(context, componentName) {
    let parents = [], parent = context.$parent;
    if (parent) {
        if (parent.$options.name === componentName) parents.push(parent);
        return parents.concat(findComponentsUpward(parent, componentName));
    } else {
        return [];
    }
}

// Find brothers components
export function findBrothersComponents(context, componentName) {
    let res = context.$parent.$children.filter(item => {
        return item.$options.name === componentName
    }), index = res.indexOf(context);
    res.splice(index, 1);
    return res;
}