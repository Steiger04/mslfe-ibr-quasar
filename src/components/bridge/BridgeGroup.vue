<template>
  <div class="row">
    <div class="col">
      <div class="column">
        <div
          class="col-grow tw-mt-3 first:tw-mt-1 last:tw-mb-1"
          v-for="(group, name) of getGroupsFromInstanceId(instance._id)"
          :key="name"
        >
          <div class="row">
            <div class="col tw-px-2">
              <q-slide-item
                left-color="green-6"
                right-color="pink-8"
                class="tw-rounded-lg tw-my-1 tw-bg-gray-900"
                @left="details => groupOn(details, group, true)"
                @right="details => groupOn(details, group, false)"
              >
                <template v-slot:left>
                  <q-icon
                    name="fas fa-toggle-on"
                    size="md"
                  />
                </template>
                <template v-slot:right>
                  <q-icon
                    name="fas fa-toggle-off"
                    size="md"
                  />
                </template>

                <div class="row justify-start items-center tw-ml-1 tw-text-gray-200"
                     style="min-height: 3.5rem">
                  <div class="col-shrink">
                    <q-icon
                      size="md"
                      :color="allZonesFromGroupActive(group._id) ? 'green-6' : 'pink-8'"
                      name="fas fa-lightbulb"
                    />
                    <q-icon
                      size="md"
                      :color="oneZoneFromGroupActive(group._id) ? 'green-6' : 'pink-8'"
                      name="fas fa-lightbulb"
                    />
                  </div>
                  <div
                    class="col ellipsis tw-px-2 q-py-xs-sm q-py-md-lg tw-self-center md:tw-text-3xl tw-tracking-wider tw-text-2xl text-weight-bold">
                    {{ group.common.name }}
                  </div>
                </div>
              </q-slide-item>
            </div>
          </div>

          <div
            class="column tw-px-5"
            v-for="(zone, name) of getZonesFromGroupId(group._id)"
            :key="name"
          >
            <div class="col-grow">
              <zone-on-off
                :zoneId="zone._id"
                :picker="zone.picker"
                :zoneCommonName="zone.common.name"
                :right=true
                :isPalette=false
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ZoneOnOff from 'components/zone/ZoneOnOff'
import streamMixin from 'components/picker/mixin/stream'

export default {
  name: 'BridgeGroup',
  mixins: [streamMixin],
  components: {
    ZoneOnOff
  },
  props: ['instance'],
  data () {
    return {}
  },
  computed: {
    ...mapState('msladapter', { statevalues: state => state.ids.statevalues }),
    ...mapGetters('msladapter',
      ['getGroupsFromInstanceId', 'getZonesFromGroupId', 'oneZoneFromGroupActive', 'allZonesFromGroupActive'])
  },
  methods: {
    ...mapActions('msladapter', ['setStateFromClient']),
    groupOn ({ reset }, group, onoff) {
      const allGroupZones = Object.keys(this.getZonesFromGroupId(group._id)).map(v => [v, onoff])

      reset()
      this.allZonesOn(allGroupZones)
    }
  }
}
</script>
