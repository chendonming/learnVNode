import { Module } from "./modules";
import { vnode, VNode } from "./vnode";

/**
 * 此类型声明将
 * {a: string, b: number } 声明为 { a: string[], b: number }
 */
type ArraysOf<T> = {
  [K in keyof T]: Array<T[K]>;
};
type ModuleHooks = ArraysOf<Required<Module>>;

const emptyNode = vnode("", {}, [], undefined, undefined);

const hooks: Array<keyof Module> = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post"
];

export function init(modules: Array<Partial<Module>>) {
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: []
  };

  // 将模块里的所有周期放入对应的钩子数组中
  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== undefined) {
        (cbs[hook] as any[]).push(currentHook);
      }
    }
  }

  /**
   * 将Element转为vnode
   */
  function emptyNodeAt(elm: Element): VNode {
    const id = elm.id ? "#" + elm.id : "";
    const classes = elm.getAttribute("class");
    const c = classes ? "." + classes.split(" ").join(".") : "";
    const sel = elm.tagName.toLowerCase() + id + c;
    return vnode(sel, {}, [], undefined, elm)
  }

  /**
   * 节点是否相同
   */
  function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
    const isSameKey = vnode1.key === vnode2.key;
    const isSameIs = vnode1.data?.is === vnode2.data?.is;
    const isSameSel = vnode1.sel === vnode2.sel;
    const isSameTextOrFragment =
      !vnode1.sel && vnode1.sel === vnode2.sel
        ? typeof vnode1.text === typeof vnode2.text
        : true;

    return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
  }

  function createElm(vnode: VNode, insertedVnodeQueue: VNode[]) {
    const data = vnode.data;
    const children = vnode.children;
    const sel = vnode.sel;

    if (sel === "") {
      // h('', {}, 'text')
      vnode.elm = document.createTextNode(vnode.text!)
    } else if (sel !== undefined) {
      // 传入数据 h("div.page", {}, 'hello world')
      // h("div#app")
      // 解析css选择器
      const hashIdx = sel.indexOf("#");
      const dotIdx = sel.indexOf(".", hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag =
        hashIdx !== -1 || dotIdx !== -1
          ? sel.slice(0, Math.min(hash, dot))
          : sel;
      const elm = document.createElement(tag, data)
      vnode.elm = elm

      if (hash < dot) elm.setAttribute("id", sel.slice(hash + 1, dot));
      if (dotIdx > 0)
        elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));

      // create钩子函数执行
      for (let i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);

      if (
        (typeof vnode.text === 'string' || typeof vnode.text === 'number')
        && (!Array.isArray(children) || children.length === 0)
      ) {
        elm.appendChild(document.createTextNode(vnode.text))
      }

      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          const ch = children[i];
          if (ch != null) {
            elm.appendChild(createElm(ch as VNode, insertedVnodeQueue))
          }
        }
      }
    } else {
      vnode.elm = document.createTextNode(vnode.text!)
    }

    return vnode.elm;
  }

  /**
   * 修补VNode 比较更新vnode
   */
  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: VNode[]
  ) {
    const elm = (vnode.elm = oldVnode.elm)!;
    if (oldVnode === vnode) return;

    if (
      vnode.data !== undefined ||
      (vnode.text !== undefined && vnode.text !== oldVnode.text)
    ) {
      vnode.data ??= {};
      oldVnode.data ??= {};
      // 执行update钩子函数
      for (let i = 0; i < cbs.update.length; ++i)
        cbs.update[i](oldVnode, vnode);
    }

    // 对比children
    const oldCh = oldVnode.children as VNode[];
    const ch = vnode.children as VNode[];

    if (vnode.text === undefined) {

    }
  }

  return function patch(oldVnode: Element | VNode, vnode: VNode) {
    let elm: Node, parent: Node;
    const insertedVnodeQueue: VNode[] = [];

    for (let i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    //nodeType === 1为 一个元素节点
    if (oldVnode instanceof Element && oldVnode.nodeType === 1) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode as VNode, vnode)) {
      patchVnode(oldVnode as VNode, vnode, insertedVnodeQueue)
    } else {
      //oldvnode与vnode不相同
      elm = (oldVnode as VNode).elm!;
      parent = elm.parentNode as Node;

      // 将vnode创建成Element
      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        parent.insertBefore(vnode.elm!, elm.nextSibling)
      }
    }

    // post钩子
    for (let i = 0; i < cbs.post.length; ++i) cbs.post[i]();

    return vnode
  }
}