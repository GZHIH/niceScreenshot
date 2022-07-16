<template>
    <div class="box0" ref="all">
        <div class="panel">
            <div class="panel-header">
                <span class="title">测试一：页面基本元素、svg图标</span>
                <a-button class="downBtn" @click="save('d1')">下载</a-button>
            </div>
            <div class="panel-body" ref="d1">
                <test1 />
            </div>
        </div>
        <div class="panel">
            <div class="panel-header">
                <span class="title">测试二：图片元素</span>
                <a-button class="downBtn" @click="save('d2')">下载</a-button>
            </div>
            <div class="panel-body" ref="d2">
                <test2 />
            </div>
        </div>
        <div class="panel">
            <div class="panel-header">
                <span class="title">测试三：canvas元素</span>
                <a-button class="downBtn" @click="save('d3')">下载</a-button>
            </div>
            <div class="panel-body" ref="d3">
                <test3 />
            </div>
        </div>

        <a-button class="all" @click="save('all')">下载全部</a-button>

        <a-button class="tobase64" @click="file2Base64">点击此处来选择图片进行base64格式转换：将会把base64数据打印至控制台</a-button>
    </div>
</template>

<script>
import niceScreenshot from './assets/js/niceScreenshot'
import file2Base64 from './assets/js/file2Base64'
import test1 from './components/table.vue'
import test2 from './components/img.vue'
import test3 from './components/canvas.vue'
// import html2canvas from "html2canvas"

export default {
    name: "App",
    components: {
        test1,
        test2,
        test3,
    },
    mounted() {
    },
    methods: {
        file2Base64,
        save(ref) {
            const html = this.$refs[ref]
            niceScreenshot(html, {
                name: `img-${new Date().getTime()}`,
                customStyle: `
                    .panel{
                        background-color: #fff;
                    }
                    .panel-body{
                        background-color: #fff;
                    }
                    .downBtn {
                        opacity: 0;
                    }
                    .box0 .all {
                        opacity: 0;
                    }
                    .tobase64 {
                        display: none;
                    }
                `,
                size: 1,
                height: html.offsetHeight - (ref === 'all' ? 120 : 0), // 120 tobase64 的高度: 100高 + 20外边框
            })
        },
    },
};
</script>

<style lang="less" scoped>
.box0 {
    padding: 12px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    .panel {
        width: 80%;
        .panel-header {
            padding: 12px 0;
            display: flex;
            justify-content: space-between;
            .title {
                font-size: 20px;
                font-weight: bold;
            }
        }
        // 如果都写在了这里，导致导出时没有识别到样式表，也可以采用在 customStyle 中重写一次该样式
        // .panel-body {
        //     padding: 12px;
        //     border-radius: 4px;
        //     border: 1px solid #000;
        // }
    }
    .all {
        position: fixed;
        left: 20px;
        top: 50%;
    }
    .tobase64 {
        width: 80%;
        height: 100px;
        font-size: 20px;
        margin-top: 20px;
        /deep/span {
            white-space: normal;
        }
    }
}

// 这种需要导出区域的样式不能写在上面，因为层级选择器的原因，导出时svg中的dom可能会无法匹配到对应样式表，导致样式失效
.panel-body {
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #000;
}
</style>
<style>
body {
    margin: 0px;
    padding: 0px;
    height: 100vh;
    overflow: auto;
}
</style>
