# niceScreenshot 轻量的网页截屏工具

## 功能介绍
- 将页面内指定dom导出为png图片；  
- 通过书写css样式修改导出时的dom样式，实现自定义导出；  
- 导出图片尺寸自定义；  
- 提供了一个转换base64的小工具;  

## 实现原理
将页面dom XML序列化后塞入svg的foreignObject标签，通过svg标签以及foreignObject渲染出原始的页面dom；将svg标签字符串拼接，转为base64数据形式，作为一个img的src，最后将这个img渲染到canvas上，通过canvas的toDataURL把base64：svg类型的图片转为base64：png类型的图片，最后通过a标签下载下来  

## 核心
### niceScreenshot.js  
暴露出一个函数：参数如下  
- dom     导出区域的dom实例（不可缺省）  
- name    导出图片的名字  
- customStyle 导出时自定义调整的样式，可以用于隐藏(建议使用opacity: 0;，使用display: none;有可能导致区域内容尺寸变化，使得内容尺寸与导出图片的尺寸不一致)、改变区域中的dom样式  
- size    导出图片的尺寸倍数; 尺寸越大越清晰，同时越消耗性能，导出越慢，可视导出区域的大小及使用客户端性能酌情考虑倍数  
### 使用注意：  
- 需要导出的页面dom，它的样式必须单独写，不能有父级选择器嵌套在它前面，因为导出时这个dom是没有父级元素的，采用层级选择器有可能样式没有准确命中dom而导致样式失效。  
- 如果导出区域中的背景图片是采用了css加载的背景图片，则必须使用base64格式的图片地址才可以成功展示，如果是其他类型：img标签、svg标签、canvas则无须担心。  
- demo提供了一个转换base64的小工具file2Base64.js，直接调用即可选择转换的资源。  

## 浏览器兼容性
（can i use 测试 foreignObject 标签）  
- PC端主流浏览器全部支持；  
- 不支持IE，Edge 79以上支持；  
- Android Browser 4以上支持；  
- 可能会有部分html5新的特性不支持，但大部分是没有问题的，故使用前需要测试；  

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```