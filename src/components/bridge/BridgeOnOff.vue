<template>
  <div class="row justify-xs-between justify-sm-around">
    <q-btn
      class="col-shrink"
      :class="{'tw-pointer-events-none': disabled$}"
      flat
      round
      color="black"
      @click.stop="makeAllZonesOn(instance, false)"
    >
      <img
        class="tw-h-20 tw-w-20 md:tw-h-32 md:tw-w-32"
        src="~assets/mslfe-onoff-button-red.svg"
      >
    </q-btn>

    <div
      class="col-shrink self-center tw-text-grey-10 tw-border-0 tw-border-green-0"
      v-show="visible"
      @click.stop="info">
      <q-icon
        class="fas fa-info-circle"
        size="lg"
      />
    </div>
    <q-btn
      class="col-shrink"
      :class="{'tw-pointer-events-none': disabled$}"
      flat
      round
      color="black"
      @click.stop="makeAllZonesOn(instance, true)"
    >
      <img
        class="tw-h-20 tw-w-20 md:tw-h-32 md:tw-w-32"
        src="~assets/mslfe-onoff-button-green.svg"
      >
    </q-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import streamMixin from 'components/picker/mixin/stream'

export default {
  name: 'BridgeOnOff',
  mixins: [streamMixin],
  filters: {
    yesno: (value) => value ? 'yes' : 'no'
  },
  props: ['instance'],
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters('msladapter', ['getGroupsFromInstanceId', 'getZonesFromGroupId'])
  },
  methods: {
    ...mapActions('msladapter', ['setStateFromClient']),
    makeAllZonesOn (instance, onoff) {
      const allInstanceZones = Object.keys(this.getGroupsFromInstanceId(instance._id))
        .map(groupId => Object.keys(this.getZonesFromGroupId(groupId)))
        .flat().map(v => [v, onoff])
      this.allZonesOn(allInstanceZones)
    },
    info () {
      this.$emit('info', this.instance.instance_id)
      this.visible = false
    }
  }
}
</script>
