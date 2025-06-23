<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="container-left"></div>
      <div class="container-right">
        <div class="welcome">
          <img style="width: 35px;" src="@/assets/images/login/line-left.png">
          欢迎登录
          <img style="width: 35px;" src="@/assets/images/login/line-right.png">
        </div>
        <div class="header">
          <a class="title" href="/">基础信息平台</a>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'

export default {
  name: 'UserLayout',
  mixins: [deviceMixin],
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      display: flex;
      position: relative;

      a {
        text-decoration: none;
      }

      .container-left{
        background: #f0f2f5 url(~@/assets/images/login/background.png) no-repeat 50%;
        background-size: 100%;
        flex: 3;
      }

      .container-right {
        flex: 2;

        .welcome{
          color: #666666;
          font-size: 20px;
          font-weight: 400;
          margin: 80px 0;
          text-align: center;

          img:nth-child(1) {
            margin-right: 8px;
          }

          img:nth-child(2) {
            margin-left: 8px;
          }
        }

        .header {
          height: 44px;
          line-height: 44px;
          margin-bottom: 64px;
          text-align: center;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }
    }
  }
</style>
