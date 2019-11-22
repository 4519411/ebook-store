import {mapGetters, mapActions} from 'vuex';
import {themeList, addCSS, removeCSSAll} from "./book";
import {saveLocation} from "./localStorage";

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle(theme) {
      removeCSSAll();
      const href = `${process.env.VUE_APP_RES_URL}/theme/theme_` + theme.toLowerCase() + ".css";
      addCSS(href)
    },
    refreshLocations() {
      let currentLocation = this.currentBook.rendition.currentLocation();
      let startCfi = currentLocation.start.cfi;
      let startProgress = this.currentBook.locations.percentageFromCfi(startCfi);
      // console.log(startProgress, currentLocation, startCfi);
      this.setProgress(Math.floor(startProgress * 100));
      this.setSection(currentLocation.start.index);
      saveLocation(this.fileName, startCfi);
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocations();
          if (cb) {
            cb();
          }
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocations();
          if (cb) {
            cb();
          }
        })
      }
    }
  }
};
