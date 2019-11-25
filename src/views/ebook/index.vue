<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
    import EbookTitle from '../../components/ebook/EbookTitle'
    import EbookReader from '../../components/ebook/EookReader'
    import EbookMenu from '../../components/ebook/EbookMenu'
    import {getReadTime, saveReadTime} from "../../utils/localStorage";
    import {ebookMixin} from "../../utils/mixin";

    export default {
        mixins: [ebookMixin],
        components: {
            EbookReader,
            EbookTitle,
            EbookMenu
        },
        methods: {
            // 每分钟记录阅读记录
            startLoopReadTime() {
                let readTime = getReadTime(this.fileName);
                if (!readTime) {
                    readTime = 0;
                }
                this.task = setInterval(() => {
                    readTime++;
                    if (readTime % 60 === 0) {
                        saveReadTime(this.fileName, readTime);
                    }
                    // console.log(readTime)
                }, 1000)
            }
        },
        mounted() {
            this.startLoopReadTime()
        },
        beforeDestroy() {
            if (this.task) {
                clearInterval(this.task);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global.scss';
</style>
