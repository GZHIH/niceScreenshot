/*
    原作者：GZHIH
    github地址：https://gitee.com/GZHIH/nice-screenshot
    码云地址：https://github.com/GZHIH/niceScreenshot
*/

class Dom2Img {
    /*
        dom     导出区域的dom实例
        option
            name    导出图片的名字
            customStyle 导出时自定义调整的样式，可以用于隐藏(建议使用opacity: 0;，使用display: none;有可能导致区域内容尺寸变化，使得内容尺寸与导出图片的尺寸不一致)、改变区域中的dom样式
            size    导出图片的尺寸倍数; 尺寸越大越清晰，同时越消耗性能，导出越慢，可根据导出区域的大小及使用客户端性能酌情考虑倍数
            width   导出区域的宽度
            height  导出区域的高度

        存在的问题
            如果导出区域中的背景图片是采用了css加载的背景图片，则必须使用base64格式的图片地址才可以成功展示，如果是其他类型：img标签、svg标签、canvas则无须担心。
            参考html2canvas库源码，它的处理方式是导出的时候重新请求了图片资源，以后可以参考它解决掉这个问题。
    */
    constructor(dom, option) {
        if (!dom) {
            console.error('缺少导出的DOM！');
        }
        const option_ = option || {
            name: new Date().getTime(),
            customStyle: '',
            size: 1,
        };
        const { name, customStyle, size, width, height } = option_;

        this.originDom = dom;
        this.name = name || new Date().getTime();
        this.customStyle = customStyle || '';
        this.size = size || 1;
        this.width = width || this.originDom.offsetWidth;
        this.height = height || this.originDom.offsetHeight;

        this.cloneDom = dom.cloneNode(true);
        this.cloneDom.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

        this.imgNodes = {
            origin: [],
            clone: [],
        };
        this.canvasNodes = {
            origin: [],
            clone: [],
        };

        const canvas = document.createElement('canvas');
        this.CANVAS = {
            canvas,
            context: canvas.getContext('2d'),
        };
        this.styleSheet = '';
        this.svgDomText = '';

        this.addImgNodes(this.originDom, this.cloneDom);
        this.renderImg();
        this.render();
        this.download();
    }
    draw(img) {
        const { canvas, context } = this.CANVAS;
        const { size } = this;
        const width = img.width * size,
            height = img.height * size;

        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(img, 0, 0, width, height);
    }
    // 处理图片性质的资源
    addImgNodes(originDom, cloneDom) {
        const { imgNodes, canvasNodes, addImgNodes } = this;
        for (let i = 0; i < originDom.childNodes.length; i++) {
            const originNode = originDom.childNodes[i];
            const cloneNode = cloneDom.childNodes[i];
            // console.log(cloneNode.tagName)
            if (originNode.tagName === 'IMG') {
                imgNodes.origin.push(originNode);
                imgNodes.clone.push(cloneNode);
            }
            if (originNode.tagName === 'CANVAS') {
                canvasNodes.origin.push(originNode);
                canvasNodes.clone.push(cloneNode);
            }
            // 过滤 text 节点 script 节点，递归
            if (originNode.nodeType !== 3 && originNode.nodeName !== 'SCRIPT' && originNode.nodeName !== 'svg' && originNode.nodeName !== '#comment') {
                addImgNodes.apply(this, [originNode, cloneNode]);
                // or
                // this.addImgNodes(originNode, cloneNode)
            }
        }
    }
    // 将图片性质的资源渲染到canvas上
    renderImg() {
        const { imgNodes, canvasNodes } = this;
        const { canvas } = this.CANVAS;

        imgNodes.clone.forEach((cloneImgItem, imgIndex) => {
            const originImgItem = imgNodes.origin[imgIndex];
            this.draw(originImgItem);
            cloneImgItem.src = canvas.toDataURL();
        });
        canvasNodes.clone.forEach((cloneCanvasItem, canvasIndex) => {
            const originCanvasItem = canvasNodes.origin[canvasIndex];
            // console.log(originCanvasItem, cloneCanvasItem)

            const IMG = document.createElement('img');
            IMG.setAttribute('src', originCanvasItem.toDataURL());
            IMG.setAttribute('width', originCanvasItem.offsetWidth);
            IMG.setAttribute('height', originCanvasItem.offsetHeight);

            cloneCanvasItem.parentNode.replaceChild(IMG, cloneCanvasItem);
        });
    }
    render() {
        // 页面所有的样式塞入
        const { originDom, cloneDom, width, height } = this;

        const { styleSheets } = document;
        let styleSheet = '<style>';
        for (let i = 0; i < styleSheets.length; i++) {
            const cssList = styleSheets[i].cssRules;
            for (let index = 0; index < cssList.length; index++) {
                if (cssList[index].selectorText) {
                    // 测试在svg中添加无用的css样式不影响最终导出的图片的大小, 所以这里无需将指定区域的样式单独摘出来塞入（也比较麻烦，比如遇到使用第三方组件的情况），直接一锅端全部塞入绝对ok
                    // 如果这里比较影响性能，可以尝试将指定区域的样式单独摘出来塞入 style 中
                    styleSheet += cssList[index].cssText;
                }
            }
        }
        styleSheet += this.customStyle;
        styleSheet += '</style>';
        this.styleSheet = styleSheet;

        const foreignObjectText = encodeURIComponent(`${this.styleSheet}${new XMLSerializer().serializeToString(cloneDom)}`);
        const svgDomText = `
            data:image/svg+xml;charset=utf-8,
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <foreignObject x="0" y="0" width="100%" height="100%">${foreignObjectText}</foreignObject>
            </svg>
        `;
        this.svgDomText = svgDomText;
    }
    download() {
        const { CANVAS, name } = this;
        const { canvas } = CANVAS;

        const finalImg = new Image();
        finalImg.onload = () => {
            this.draw(finalImg);
            downloadImgByBase64(canvas.toDataURL('image/png', 1), name);
        };
        // 给图片对象添加图片地址，触发onload
        finalImg.src = this.svgDomText;
        // document.body.appendChild(finalImg)
    }
}

const downloadImgByBase64 = (base64URL, fileName) => {
    const $a = document.createElement('a');
    $a.download = `${fileName}`;
    $a.target = '_blank';
    $a.href = base64URL;
    const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
    });
    $a.dispatchEvent(evt);
};

export default (dom, option) => new Dom2Img(dom, option);
