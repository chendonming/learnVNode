export interface VNode {
  sel: string | undefined;
  data: any
  children: Array<VNode | string> | undefined;
  elm: Node | undefined;
  text: string | undefined;
  key: string | number | symbol | undefined;
}

export interface VNodeData {
  props?: Record<string, any>
  attrs?: Record<string, string | number | boolean>
  class?: Record<string, boolean>
  style?: Partial<CSSStyleDeclaration>
}

/**
 * 简单包装
 */
export function vnode(sel: string | undefined, data: any | undefined, children: Array<VNode | string> | undefined, text: string | undefined, elm: Element | undefined) {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, key, elm };
}