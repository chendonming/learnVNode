import type { VNode } from '../vnode'

/**
 * 模块可以提供以下生命周期函数
 */
export type Module = Partial<{
  pre: () => any,
  create: (emptyVNode: VNode, vNode: VNode) => any,
  update: (oldVNode: VNode, vNode: VNode) => any,
  destroy: (vNode: VNode) => any,
  remove: (vNode: VNode, removeCallback: () => void) => any,
  post: () => any
}>;