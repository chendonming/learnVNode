import { VNode, VNodeData } from ".";
import { vnode } from "./vnode";

export type VNodeChildElement = VNode | string
export type VNodeChildren = VNodeChildElement | VNodeChildElement[]

export function h(sel: any, b: any, c: any) {
  let data, children, text;
  if (c !== undefined) {
    if (b !== undefined) {
      data = b;
    }

    if (Array.isArray(c)) {
      children = c;
    } else if (typeof c === 'string' || typeof c === 'number') {
      text = c.toString();
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== undefined) {
    //h('div.page', [h('a.href')])
    if (Array.isArray(b)) {
      children = b;
    } else if (typeof b === 'string' || typeof b === 'number') {
      text = b.toString();
    } else if (b && b.sel) {
      children = [b]
    } else {
      // h('div.page', { style: { color: 'red' } })
      data = b
    }
  }

  if (children !== undefined) {
    for (let i = 0; i < children.length; i++) {
      if (typeof children[i] === 'string' || typeof children[i] === 'number') {
        children[i] = vnode(sel, data, children, text)
      }
    }
  }

  return vnode(sel, data, children, text)
}