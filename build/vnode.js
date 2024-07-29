/**
 * 简单包装
 */
export function vnode(sel, data, children, text, elm) {
    const key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, key, elm };
}
//# sourceMappingURL=vnode.js.map