<template>
  <transition name="fade">
    <div class="slide-content-warpper" v-show="menuVisible && settingVisible === 3">
      <transition name="slide-right">
        <div class="content" v-show="settingVisible === 3">
          <div class="content-page-warpper">
            <div class="content-page">
              <!-- <component :is="currentTab === 1 ? content : bookmark"></component> -->
            </div>
            <div class="content-page-tab">
              <div class="content-page-tab-item" :class="{'selected': currentTab === 1}" @click="selectTab(1)">
                {{$t('book.navigation')}}
              </div>
              <div class="content-page-tab-item" :class="{'selected': currentTab === 2}" @click="selectTab(2)">
                {{$t('book.bookmark')}}
              </div>
            </div>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hideTitleAndMenu()"></div>
    </div>
  </transition>
</template>

<script>
    import {ebookMixin} from "../../utils/mixin";
    import EbookSlideContents from "./EbookSlideContents";
    import EbookSlideBookmark from "./EbookSlideBookmark";

    export default {
        mixins: [ebookMixin],
        data() {
            return {
                currentTab: 1,
                content: EbookSlideContents,
                bookmark: EbookSlideBookmark
            }
        },
        methods: {
            selectTab(index) {
                return this.currentTab = index;
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .slide-content-warpper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    height: 100%;
    display: flex;

    .content {
      flex: 0 0 85%;
      width: 85%;
      height: 100%;

      .content-page-warpper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        .content-page {
          flex: 1;
          width: 100%;
          overflow: hidden;

        }

        .content-page-tab {
          display: flex;
          flex: 0 0 px2rem(48);
          width: 100%;
          height: px2rem(48);

          .content-page-tab-item {
            flex: 1;
            font-size: px2rem(12);
            @include center;
          }
        }
      }
    }

    .content-bg {
      flex: 0 0 15%;
      width: 15%;
      height: 100%;
      background-color: #333333;
      opacity: 0.2;
    }
  }

</style>
