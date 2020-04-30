<template>
  <transition
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div v-show="visible" class="column relative-position items-center">
      <div class="row items-center">
        <div class="inline-block tw-border-0">
          <img
            @click.stop="$q.fullscreen.toggle()"
            class="tw-h-12 tw-w-12"
            :src="`../statics/img/msl-${boxTypeName}-web-alpha.png`"
          >
        </div>

        <div class="inline-block tw-border-0 tw-ml-2">
          <div class="tw-tracking-widest tw-text-gray-400 tw-text-xl tw-font-medium">
            {{ instance.instance_id }}
          </div>
          <div>
            <span class="tw-text-gray-600">{{ boxTypeName }}</span>
            <span class="tw-text-gray-600 text-bold"> | </span>
            <span class="tw-tracking-widest tw-text-gray-600">{{ instance.native.controllerIp }}</span>
          </div>
        </div>
      </div>

      <div class="row items-center tw-mt-2">
        <div>
          <div class="tw-inline-block tw-mr-1 tw-tracking-wide tw-text-xs tw-text-gray-500 tw-uppercase">
            connected
          </div>
          <q-badge
            :class="{['tw-bg-green-700 tw-text-green-100']: connected,
                   ['tw-bg-red-700 tw-text-red-100']: !connected}"
          >
            {{ connected | yesno }}
            <q-icon
              size="xs"
              :class="{['fas fa-thumbs-up tw-ml-2 tw-my-px']: connected,
                     ['fas fa-frown tw-ml-2 tw-my-px']: !connected}"
            />
          </q-badge>
        </div>

        <div class>
          <div class="tw-inline-block tw-mr-1 tw-ml-4 tw-text-gray-500 tw-text-xs tw-tracking-wide tw-uppercase">
            alive
          </div>
          <q-badge
            :class="{['tw-bg-green-700 tw-text-green-100']: alive,
                   ['tw-bg-red-700 tw-text-red-100']: !alive}"
          >
            {{ alive | yesno }}
            <q-icon
              size="xs"
              :class="{['fas fa-thumbs-up tw-ml-2 tw-my-px']: alive,
                     ['fas fa-frown tw-ml-2 tw-my-px']: !alive}"
            />
          </q-badge>
        </div>

        <div
          v-show="isConnectedAndAlive"
          class="absolute-top-right tw-mr-2 tw-text-grey-10 tw-mt-0 tw-border-0 tw-border-green-0">
          <q-icon
            @click.stop="invisible"
            class="float-right fas fa-times-circle tw-ml-2 tw-my-px"
            size="sm"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BridgeStatus',
  data () {
    return {
      visible: true
    }
  },
  filters: {
    yesno: (value) => value ? 'yes' : 'no'
  },
  props: ['instance'],
  computed: {
    ...mapState('msladapter', {
      statevalues: state => state.ids.statevalues }),
    isConnectedAndAlive () {
      return (this.statevalues[this.instance._id + '.' + 'connected'].val &&
        this.statevalues[this.instance._id + '.' + 'alive'].val)
    },
    alive () {
      return this.statevalues[this.instance._id + '.' + 'alive'].val
    },
    boxTypeName () {
      return this.instance.native.controllerType === 'v6' ? this.instance.native.iBox : 'legacy'
    },
    connected () {
      return this.statevalues[this.instance._id + '.' + 'connected'].val
    }
  },
  methods: {
    invisible () {
      this.visible = false
      this.$emit('invisible', this.instance.instance_id)
    }
  }
}
</script>
