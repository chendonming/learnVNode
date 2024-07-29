# 手动实现虚拟DOM

一直以来就只是对虚拟DOM有个大概的了解，知道是通过Proxy或者get set来对数据进行代理，从而实现双向绑定的。但是到底是如何实现的，一直没有深入的探索。所以，这勾起了我的一泡浓厚的兴趣。

## 开始搭建

技术选择`typescript`, 只是做个基础库的话，肯定不要用`webpack`这种大块头，所以选择纯手动档搭建。
我们需要一个本地服务器用于显示成果，我使用了`serve`作为小型服务器，以下是安装的版本

```json
"serve": "^14.2.3",
"typescript": "^5.5.4"
```

serve需要一些配置，用于正确显示页面，下面的配置用于告诉`serve`build目录返回`application/javascript`

```json
{
  "rewrites": {
    { "source": "build/:file", "destination": "build/:file.js" }
  }
}
```

## 设定外部调用方式

```js
const patch = Init([xxxModule1, xxxModule2, xxxModule3, MyModule])

const MyModule = {
  create() {},
  post() {},
  destory() {}
}

const dom = document.getElementById('pass')

patch(dom, h('div#app', { style: { color: 'red' } }))

// 需要刷新时继续调用
patch(dom, h('div#app', { style: { color: 'red' } }))
```
