<template>
  <div class="loading-animation">
    <i v-for="(char, index) in '-'.repeat(12)"
      :key="index">
      <i></i>
    </i>
  </div>
</template>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  @include keyframes(loading-animation) {
    0% {
      @include transform(scale(3, 3));
    }
    100% {
      @include transform(scale(1, 1));
    }
  }

  .loading-animation {
    @include transform(
      translate(sz(-60.5), sz(-60.5)) scale(0.605) translate(sz(60.5), sz(60.5))
    );

    width: sz(121);
    height: sz(121);
    position: relative;

    > i {
      > i {
        @include animation(loading-animation 1.6s linear infinite);

        position: absolute;
        width: sz(4);
        height: sz(4);
        border-radius: 50%;
        background: map-get($colors, pure-white);
      }

      &:nth-child(1) {
        @include transform(rotate(0deg));
        @include transform-origin(sz(148) sz(100));

        > i {
          @include animation-delay(-1.466666666666667s);

          left: sz(144.6);
          top: sz(96.6);
        }
      }

      &:nth-child(2) {
        @include transform(rotate(30deg));
        @include transform-origin(sz(141.569219392) sz(124));

        > i {
          @include animation-delay(-1.333333333333333s);

          left: sz(138.169219392);
          top: sz(120.6);
        }
      }

      &:nth-child(3) {
        @include transform(rotate(60deg));
        @include transform-origin(sz(124) sz(141.569219392));

        > i {
          @include animation-delay(-1.2s);

          left: sz(120.6);
          top: sz(138.169219392);
        }
      }

      &:nth-child(4) {
        @include transform(rotate(90deg));
        @include transform-origin(sz(100) sz(148));

        > i {
          @include animation-delay(-1.066666666666667s);

          left: sz(96.6);
          top: sz(144.6);
        }
      }

      &:nth-child(5) {
        @include transform(rotate(120deg));
        @include transform-origin(sz(76) sz(141.569219392));

        > i {
          @include animation-delay(-0.933333333333333s);

          left: sz(72.6);
          top: sz(138.169219392);
        }
      }

      &:nth-child(6) {
        @include transform(rotate(150deg));
        @include transform-origin(sz(58.430780608000006) sz(124));

        > i {
          @include animation-delay(-0.8s);

          left: sz(55.030780608);
          top: sz(120.6);
        }
      }

      &:nth-child(7) {
        @include transform(rotate(180deg));
        @include transform-origin(sz(52.00000000000001) sz(100));

        > i {
          @include animation-delay(-0.666666666666667s);

          left: sz(48.6);
          top: sz(96.6);
        }
      }

      &:nth-child(8) {
        @include transform(rotate(210deg));
        @include transform-origin(sz(58.430780608000006) sz(76));

        > i {
          @include animation-delay(-0.533333333333333s);

          left: sz(55.030780608);
          top: sz(72.6);
        }
      }

      &:nth-child(9) {
        @include transform(rotate(240deg));
        @include transform-origin(sz(76) sz(58.430780608000006));

        > i {
          @include animation-delay(-0.4s);

          left: sz(72.6);
          top: sz(55.030780608);
        }
      }

      &:nth-child(10) {
        @include transform(rotate(270deg));
        @include transform-origin(sz(100) sz(52.00000000000001));

        > i {
          @include animation-delay(-0.266666666666667s);

          left: sz(96.6);
          top: sz(48.6);
        }
      }

      &:nth-child(11) {
        @include transform(rotate(300deg));
        @include transform-origin(sz(124) sz(58.430780608000006));

        > i {
          @include animation-delay(-0.133333333333333s);

          left: sz(120.6);
          top: sz(55.030780608);
        }
      }

      &:nth-child(12) {
        @include transform(rotate(330deg));
        @include transform-origin(sz(141.569219392) sz(76));

        > i {
          @include animation-delay(0s);

          left: sz(138.169219392);
          top: sz(72.6);
        }
      }

      &:nth-child(13) {
        @include transform(rotate(360deg));
        @include transform-origin(sz(148) sz(100));

        > i {
          @include animation-delay(0.133333333333333s);

          left: sz(144.6);
          top: sz(96.6);
        }
      }
    }
  }
</style>
