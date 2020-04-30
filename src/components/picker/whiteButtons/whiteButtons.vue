<template>
  <div class="column justify-around" :style="cssProps">
    <div class="col-shrink">
      <div class="row justify-around">
        <div class="col-shrink">
          <q-btn :ripple="false"
                 round
                 :class="{ active: activeColor==='#fffffe' && whiteButtons$ !== false }"
                 @touchstart.native="activeColor='#fffffe'"
                 v-stream:touchstart.native="{subject: touchstart$, data: 'brightUp'}"
                 v-stream:touchend.native="touchend$">
            <q-avatar size="7rem">
              <img src="~assets/msl-brighterdarker-button-white.svg">
            </q-avatar>
          </q-btn>
        </div>
        <div class="col-shrink">
          <q-btn :ripple="false"
                 round
                 :class="{ active: activeColor==='#42a5f5' && whiteButtons$ !== false }"
                 @touchstart.native="activeColor='#42a5f5'"
                 v-stream:touchstart.native="{subject: touchstart$, data: 'cooler'}"
                 v-stream:touchend.native="touchend$">
            <q-avatar size="7rem">
              <img src="~assets/msl-colderwarmer-button-blue.svg">
            </q-avatar>
          </q-btn>
        </div>
      </div>
    </div>

    <div class="col-shrink">
      <div class="row justify-around">
        <div class="col-shrink">
          <q-btn :ripple="false"
                 round
                 :class="{ active: activeColor==='#616161' && whiteButtons$ !== false }"
                 @touchstart.native="activeColor='#616161'"
                 v-stream:touchstart.native="{subject: touchstart$, data: 'brightDown'}"
                 v-stream:touchend.native="touchend$">
            <q-avatar size="7rem">
              <img src="~assets/msl-brighterdarker-button-black.svg">
            </q-avatar>
          </q-btn>
        </div>
        <div class="col-shrink">
          <q-btn :ripple="false"
                 round
                 :class="{ active: activeColor==='#fff176' && whiteButtons$ !== false }"
                 @touchstart.native="activeColor='#fff176'"
                 v-stream:touchstart.native="{subject: touchstart$, data: 'warmer'}"
                 v-stream:touchend.native="touchend$">
            <q-avatar size="7rem">
              <img src="~assets/msl-colderwarmer-button-yellow.svg">
            </q-avatar>
          </q-btn>
        </div>
      </div>
    </div>

    <div class="col-shrink">
      <div class="row justify-center">
        <div class="col-shrink">
          <q-btn :ripple="false"
                 round
                 :class="{ active: activeColor==='#ffffff' && whiteButtons$ !== false }"
                 @touchstart.native="activeColor='#ffffff'"
                 v-stream:touchstart.native="{subject: touchstart$, data: 'maxBright'}"
                 v-stream:touchend.native="touchend$">
            <q-avatar size="7rem">
              <img src="~assets/msl-brighterdarker-button-maxwhite.svg">
            </q-avatar>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import streamMixin from 'components/picker/mixin/stream'

export default {
  name: 'whiteButtons',
  mixins: [streamMixin],
  data () {
    return {
      activeColor: '#000000'
    }
  },
  computed: {
    cssProps () {
      return { '--test-color': this.activeColor }
    }
  }
}
</script>

<style>
  .active::before {
    content: '';
    width: 7rem;
    height: 7rem;
    border-radius: 100%;
    border: 6px solid var(--test-color);
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ring 0.23s infinite;
  }

  @keyframes ring {
    0% {
      width: 7.5rem;
      height: 7.5rem;
      opacity: 1;
    }
    100% {
      width: 12rem;
      height: 12rem;
      opacity: 0.25;
    }
  }
</style>
