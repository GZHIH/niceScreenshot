<template>
    <div class="mm">
        <img src="../assets/img/jay1.webp" class="m1">
        <div class="m2"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
};
</script>

<style lang="less" scoped>
@import '../assets/less/base64.less';
.mm {
    width: 100%;
    display: flex;
    .m1 {
        width: 66%;
    }
    .m2 {
        width: 34%;
        background-image: url(@IMG2);
        background-size: 100% 100%;
    }
}
</style>