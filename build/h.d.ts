import { VNode } from ".";
export type VNodeChildElement = VNode | string;
export type VNodeChildren = VNodeChildElement | VNodeChildElement[];
export declare function h(sel: any, b: any, c: any): {
    sel: string | undefined;
    data: any;
    children: (string | VNode)[] | undefined;
    text: string | undefined;
    key: any;
    elm: Element | undefined;
};
