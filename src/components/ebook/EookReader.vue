<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
    import {FONT_SIZE_LIST} from "../../utils/book";
    import {ebookMixin} from "../../utils/mixin";
    import Epub from "epubjs";
    import {
        saveFontFamily,
        getFontFamily,
        saveFontSize,
        getFontSize,
        getTheme,
        saveTheme
    } from "../../utils/localStorage"

    global.ePub = Epub;
    export default {
        mixins: [ebookMixin],
        data() {
            return {
                fontSizeList: FONT_SIZE_LIST
            }
        },
        mounted() {
            const fileName = this.$route.params.fileName.split("|").join("/");
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
            initRendition() {
                this.renditon = this.book.renderTo("read", {
                    width: innerWidth,
                    height: innerHeight,
                    method: "default"
                });

                this.renditon.display().then(() => {
                    this.initTheme();
                    this.initFontFamily();
                    this.initFontSize();
                    this.initGlobalStyle(getTheme(this.fileName));
                });

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
            },
            initGesture() {
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
                });
            },
            initFontFamily() {
                let cachedFontFamily = getFontFamily(this.fileName);
                if (!cachedFontFamily) {
                    saveFontFamily(this.fileName, this.defaultFontFamily)
                } else {
                    this.setDefaultFontFamily(cachedFontFamily);
                    this.book.rendition.themes.font(cachedFontFamily)
                }
            },
            initFontSize() {
                let cachedFontSize = getFontSize(this.fileName);
                if (!cachedFontSize) {
                    saveFontSize(this.fileName, this.defaultFontSize)
                } else {
                    this.setDefaultFontSize(cachedFontSize);
                    this.book.rendition.themes.fontSize(cachedFontSize)
                }
            },
            initTheme() {
                this.themeList.forEach(theme => {
                    this.book.rendition.themes.register(theme.name, theme.style)
                });
                let cachedTheme = getTheme(this.fileName);
                if (!cachedTheme) {
                    cachedTheme = this.themeList[0].name;
                    this.setDefaultTheme(cachedTheme);
                    saveTheme(this.fileName, cachedTheme)
                }
                this.book.rendition.themes.select(cachedTheme)
            },
            initEpub() {
                const url = `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + ".epub";
                this.book = new Epub(url);
                this.setCurrentBook(this.book);

                this.initRendition();
                this.initGesture();
                this.book.ready.then(() => {
                    return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
                }).then(locations => {
                    // console.log(locations)
                    this.setBookAvailable(true)
                })
            }
        }
    };
</script>

<style>
</style>
