<template>
  <transition enter-active-class="animated fadeInLeft">
    <q-page class="tw-container tw-mx-auto">
      <div class="row justify-center">
        <div class="col-grow">
          <q-carousel
            class="tw-h-screen tw-bg-black"
            v-model="slide"
            transition-prev="fade"
            transition-next="fade"
            swipeable
            keep-alive
            animated
            infinite
          >
            <q-carousel-slide
              v-for="(instance, index) in getInstancesAsArray"
              :key="index"
              :name="instance.instance_id"
              class="column tw-p-0"
            >

              <bridge-status
                class="col-shrink tw-mt-1"
                ref="bridgestatus"
                @invisible="id => $refs.bridgeonoff.find(onoff => onoff.instance.instance_id === id).visible = true"
                :instance="instance"
              />

              <bridge-group
                class="col tw-mt-3 tw-mb-1 tw-mx-1 tw-overflow-y-auto tw-border-4 tw-rounded-lg tw-border-grey-9"
                :class="{'tw-pointer-events-none tw-opacity-25': !isConnectedAndAlive}"
                :instance="instance"
              />

              <bridge-on-off
                class="col-shrink tw-mx-6 tw-mb-1"
                :class="{'tw-pointer-events-none tw-opacity-25': !isConnectedAndAlive}"
                :instance="instance"
                ref="bridgeonoff"
                @info="id => $refs.bridgestatus.find(status => status.instance.instance_id === id).visible = true"/>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BridgeStatus from 'components/bridge/BridgeStatus'
import BridgeGroup from 'components/bridge/BridgeGroup'
import BridgeOnOff from 'components/bridge/BridgeOnOff'

export default {
  name: 'PageBridge',
  components: {
    BridgeStatus,
    BridgeGroup,
    BridgeOnOff
  },
  props: ['instanceId'],
  data () {
    return {
      slide: this.instanceId
    }
  },
  computed: {
    ...mapState('msladapter', {
      statevalues: state => state.ids.statevalues,
      instances: state => state.ids.instances
    }),
    ...mapGetters('msladapter', ['getInstancesAsArray']),
    isConnectedAndAlive () {
      return (this.statevalues[this.instances[this.slide]._id + '.' + 'connected'].val &&
        this.statevalues[this.instances[this.slide]._id + '.' + 'alive'].val)
    }
  }
}
</script>
