<template>
  <div class="paginator">
    <!-- 开头自定义内容 -->
    <slot name="leadingMsg">
      <span class="paginator__total">共 {{ totalRecords }} 条 </span>
    </slot>

    <template v-for="(page, index) in pages">
      <a
        v-if="page.type === 'prev'"
        :key="index"
        :class="{'paginator__link--disabled': page.disabled}"
        class="paginator__link paginator__link-goprev"
        href="javascript:;"
        @click="changePage(page)">
        <template v-if="prevText">
          {{ prevText }}
        </template>
        <template v-else>
          <b class="paginator__link-goprev-arrow"></b>
        </template>
      </a>
      <a
        v-else-if="page.type === 'normal'"
        :key="index"
        :class="{'paginator__link--active': page.num === curPage}"
        class="paginator__link"
        href="javascript:;"
        @click="changePage(page)">
        {{ page.num }}
      </a>
      <a
        v-else-if="page.type === 'ellipsis' && showEllipsis"
        :key="index"
        class="paginator__ddd">···</a>
      <a
        v-else-if="page.type === 'next'"
        :key="index"
        :class="{'paginator__link--disabled': page.disabled}"
        class="paginator__link paginator__link-gonext"
        href="javascript:;"
        @click="changePage(page)">
        <template v-if="nextText">
          {{ nextText }}
        </template>
        <template v-else>
          <b class="paginator__link-gonext-arrow"></b>
        </template>
      </a>
    </template>

    <!-- 结尾自定义内容 -->
    <slot name="trailingMsg"></slot>

    <!-- 跳转页面输入框 -->
    <slot name="pagebox">
      <!-- 只有在有页面的时候才显示翻页输入框 -->
      <template v-if="totalRecords > 0">
        <span class="paginator__word">前往</span>
        <input
          v-model="jumpPage"
          class="paginator__jumpinput"
          type="text"
          @keyup.enter="enterChangePage"
        /> 页
      </template>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "paginator",

    props: {
      // 上一页 文案，如果为null，就显示左箭头
      prevText: {
        type: String,
        default: null
      },

      // 下一页 文案，如果为null，就显示右箭头
      nextText: {
        type: String,
        default: null
      },

      // 总记录数
      totalRecords: {
        type: Number,
        default: 0,
        validator: function(value) {
          const parsed = parseInt(value);

          return typeof(parsed) === "number" &&
            parsed > -1 &&
            parsed === value;
        }
      },

      // 每页显示条数
      pageSize: {
        type: Number,
        default: 0,
        validator: function(value) {
          const parsed = parseInt(value);

          return typeof(parsed) === "number" &&
            parsed > -1 &&
            parsed === value;
        }
      },

      // 当前页
      curPage: {
        type: Number,
        default: 1,
        validator: function(value) {
          const parsed = parseInt(value);

          return typeof(parsed) === "number" &&
            parsed > 0 &&
            parsed === value;
        }
      },

      // 是否显示省略符号
      showEllipsis: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        // 输入框当前展示的页数（和当前高亮页同步）
        jumpPage: 0
      };
    },

    computed: {
      // 当前可用的所有渲染项（包含前后跳转页，省略符号，页数）
      pages() {
        return this.getPageList();
      },

      // 计算出来的总页数
      totalPages() {
        return this.getTotalPages();
      }
    },

    watch: {
      // 父亲传过来的curPage发生了变化，立即同步本地输入框的值
      curPage(page) {
        this.updateJumpPage(page);
      },

      // 如果总页数发生变化而当前页没有发生变化,输入框的值也不会变化
      totalRecords() {
        this.updateJumpPage(this.curPage);
      }
    },

    mounted() {
      // 初始同步一次父亲 curPage 到本地输入框（否则 watch 不生效）
      this.jumpPage = this.curPage;
    },

    methods: {
      // 更新本地输入框的页数
      updateJumpPage(page) {
        this.jumpPage = page;
      },

      // 获得可已渲染的页数元信息列表
      getPageList() {
        let pageList = [],

            curPage = this.curPage,
            totalPages = this.totalPages,

            preparedPages = [],
            prevLackingPages = 0,
            followingLackingPages = 0,

            firstPreparedPage,
            lastPreparedPage;

        if (totalPages === 0) {
          return pageList;
        }

        // display the previous two and the following two (if found)
        let startIndex = curPage - 2;
        let endIndex = curPage + 2;

        // 处理前五页分页
        if (curPage === 4 && totalPages > 6) {
          endIndex--;
        }

        // 处理最后五页分页
        if (curPage === totalPages - 3 && totalPages > 7) {
          startIndex ++;
        }

        for (let i = startIndex; i <= endIndex; i++) {
          // previous found invalid, continue the next round
          if (i < 1) {
            prevLackingPages++;

            continue;
          }

          // following found invalid, continue the next round
          if (i > totalPages) {
            followingLackingPages++;

            continue;
          }

          preparedPages.push(i);
        }

        // record the first page to be rendered
        firstPreparedPage = preparedPages[0];
        // record the last page to be rendered
        lastPreparedPage = preparedPages[preparedPages.length - 1];

        // complete the previous lacking ones
        for (
          let i = lastPreparedPage + 1;
          i <= lastPreparedPage + prevLackingPages;
          i++
        ) {
          // following items overflowed.
          if (i > totalPages) {
            continue;
          }

          preparedPages.push(i);
        }

        // complete the following lacking ones
        for (
          let i = firstPreparedPage - 1;
          i >= firstPreparedPage - followingLackingPages;
          i--
        ) {
          // previous items overflowed.
          if (i < 1) {
            continue;
          }

          preparedPages.unshift(i);
        }

        // the final list of page to be rendered(not taking into count
        // the pagination buttons)
        for (
          let i = preparedPages[0];
          i <= preparedPages[preparedPages.length - 1];
          i++
        ) {
          pageList.push({
            type: "normal",
            num: i
          });
        }

        // link to first page
        // add an showEllipsis icon.
        if (totalPages > 6 && curPage > 4) {
          if (this.showEllipsis) {
            pageList.unshift({type: "ellipsis"});
          }
        }

        if (curPage > 3 && totalPages > 5) {
          pageList.unshift({
            type: "normal",
            num: 1
          });
        }

        // link to previous page.
        pageList.unshift({
          type: "prev",
          disabled: curPage - 1 < 1,
          num: curPage - 1 < 1
            ? null
            : curPage - 1
        });

        // link to last page.
        // add an showEllipsis icon.
        if (
          totalPages > 6 && curPage < totalPages - 3 ||
          curPage === 4 && totalPages === 7
        ) {
          if (this.showEllipsis) {
            pageList.push({type: "ellipsis"});
          }
        }

        if ((curPage < totalPages - 2) && totalPages > 5) {
          pageList.push({
            type: "normal",
            num: totalPages
          });
        }

        // link to next page.
        pageList.push({
          type: "next",
          disabled: curPage + 1 > totalPages,
          num: curPage + 1 > totalPages
            ? null
            : curPage + 1
        });

        return pageList;
      },

      // 回车换页
      // 需要判断边界以及合法性
      enterChangePage() {
        let raw = this.jumpPage.trim(),
            num = parseInt(raw);

        // 是合法页数才发出事件，否则不做操作
        if (/^[1-9]\d*$/.test(raw) && (num > 0 && num <= this.totalPages)) {
          this.changePage({num});
        }
      },

      changePage(pageMeta) {
        // current page is diabled or page not changed at all?
        if (pageMeta.disabled || pageMeta.num === this.curPage) {
          return;
        }

        // told other components to receive new page number.
        this.$emit("changePage", pageMeta.num);
      },

      getTotalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .paginator {
    @extend %normalized-list;

    font-size: map-get($font-sizes, xs);
    border: 1px solid transparent;

    &__total {
      padding: 0 sz(5);
      color: map-get($colors, text-color);
    }

    text-align: center;

    a {
      color: map-get($colors, text-color);
      text-decoration: none;
    }

    &__link,
    &__ddd {
      display: inline-block;
      padding: 0 sz(3);
      min-width: sz(20);
      height: sz(25);

      line-height: sz(25);
      text-align: center;

      border: 1px solid map-get($colors, paginator-light-border);
      border-left: none;
      margin-bottom: sz(-9);
    }

    &__link {
      &:first-child {
        margin-left: 0;
      }

      &:hover {
        color: map-get($colors, theme-blue);
      }

      &-goprev,
      &-gonext {
        width: sz(20);
        height: sz(25);
        line-height: sz(25);

        // 左右翻页箭头
        &-arrow {
          @include transform(rotate(45deg));

          margin-top: 1px;
          display: inline-block;
          width: sz(8);
          height: sz(8);
        }
      }

      &-goprev {
        $_parent-goprev: &;

        @include border-radius(3px 0 0 3px);

        border-left: 1px solid map-get($colors, paginator-light-border);

        &-arrow {
          margin-left: sz(6);
          border-left: 1px solid map-get($colors, text-color);
          border-bottom: 1px solid map-get($colors, text-color);
        }

        @at-root #{get-bem-root()}__link--disabled#{&} {
          cursor: default;

          #{$_parent-goprev}-arrow {
            border-left-color: map-get($colors, paginator-border);
            border-bottom-color: map-get($colors, paginator-border);
          }
        }
      }

      &-gonext {
        $_parent-gonext: &;

        @include border-radius(0 3px 3px 0);

        &-arrow {
          margin-right: sz(6);
          border-top: 1px solid map-get($colors, text-color);
          border-right: 1px solid map-get($colors, text-color);
        }

        @at-root #{get-bem-root()}__link--disabled#{&} {
          cursor: default;

          #{$_parent-gonext}-arrow {
            border-top-color: map-get($colors, paginator-border);
            border-right-color: map-get($colors, paginator-border);
          }
        }
      }

      &--active {
        cursor: default;

        @at-root #{get-bem-root()} & {
          color: map-get($colors, pure-white);
          border: 1px solid map-get($colors, theme-blue);
          background: map-get($colors, theme-blue);
          height: sz(25);
          line-height: sz(25);
        }
      }
    }

    &__jumpinput {
      @include border-radius(4px);

      height: sz(25);
      line-height: sz(25);
      width: sz(50);
      border: 1px solid map-get($colors, paginator-light-border);
      padding: 0 sz(3);
      text-align: center;
      color: map-get($colors, text-color);

      &:focus {
        border: 1px solid map-get($colors, theme-blue);
      }
    }

    &__word {
      margin: 0 0 0 sz(5);
    }
  }
</style>
