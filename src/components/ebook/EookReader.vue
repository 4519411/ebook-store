<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
    import {ebookMixin} from "../../utils/mixin"
    import Epub from "epubjs"
    import {setBookFontFamily, getBookFontFamily} from "../../utils/localStorage"

    global.ePub = Epub;
    export default {
        mixins: [ebookMixin],
        mounted() {
            const fileName = this.$route.params.fileName.split("|").join("/")
            // console.log(fileName)
            // console.log(this)
            this.setFileName(fileName).then(() => {
                    this.initEpub();
                }
            );
        },
        methods: {
            prevPage() {
                if (this.renditon) {
                    this.renditon.prev();
                    this.hideTitleAndMenu();
                }
            },
            nextPage() {
                if (this.renditon) {
                    this.renditon.next();
                    this.hideTitleAndMenu();
                }
            },
            toggleTitleAndMenu() {
                // this.$store.dispatch('setMenuVisible', !this.menuVisible)
                if (this.menuVisible) {
                    this.setSettingVisible(-1);
                }
                this.setMenuVisible(!this.menuVisible);
            },
            hideTitleAndMenu() {
                // this.$store.dispatch('setMenuVisible', false)
                this.setMenuVisible(false);
                this.setSettingVisible(-1);
            },
            initEpub() {
                const url = "http://localhost:8081/epub/" + this.fileName + ".epub";
                //   console.log(url);
                this.book = new Epub(url);
                this.setCurrentBook(this.book)
                this.renditon = this.book.renderTo("read", {
                    width: innerWidth,
                    height: innerHeight,
                    method: "default"
                });

                this.renditon.display().then(() => {
                    let cachedFileName = getBookFontFamily(this.fileName)
                    if (!cachedFileName) {
                        setBookFontFamily(this.fileName, this.defaultFontFamily)
                    }
                    this.book.rendition.themes.font(cachedFileName)
                })
                this.renditon.on("touchstart", event => {
                    this.touchStartX = event.changedTouches[0].clientX;
                    this.touchStartTime = event.timeStamp;
                });
                this.renditon.on("touchend", event => {
                    const offsetX = event.changedTouches[0].clientX - this.touchStartX;
                    const time = event.timeStamp - this.touchStartTime;
                    // console.log(offsetX, time)
                    if (time < 500 && offsetX > 40) {
                        this.prevPage();
                    } else if (time < 500 && offsetX < -40) {
                        this.nextPage();
                    } else {
                        this.toggleTitleAndMenu();
                    }
                    event.preventDefault();
                    event.stopPropagation();
                })
                this.renditon.hooks.content.register(contents => {
                    Promise.all([
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
                        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
                    ]).then(() => {
                        // console.log('字体加载完毕')
                    })
                })
            }
        }
    };
</script>

<style>
</style>
