import color from 'tinycolor2'

export const getInstancesAsArray = state => [...state.ids.instances]

export const getInstanceNames = state => Array.from(new Set([...state.ids.groups].map(v => v[1].from)))

export const getGroupsFromInstanceId = state => id => Object.fromEntries([...state.ids.groups]
  .filter(group => group[1].from === id))

export const getZonesFromGroupId = state => id => Object.fromEntries([...state.ids.zones]
  .filter(zone => zone[1].common.group_id === id))

export const oneZoneFromGroupActive = (state, getters) => groupId => Object.keys(getters.getZonesFromGroupId(groupId))
  .map(zoneId => state.ids.statevalues[zoneId + '.on'].val).includes(true)

export const allZonesFromGroupActive = (state, getters) => groupId => Object.keys(getters.getZonesFromGroupId(groupId))
  .map(zoneId => state.ids.statevalues[zoneId + '.on'].val).every(state => state === true)

export const getColorFromZone = state => id => {
  const on = state.ids.statevalues[id + '.on']
  const rgb = state.ids.statevalues[id + '.rgb']

  return (rgb !== undefined ? rgb.val : (on.val === true ? '#ffffff' : '#000000'))
}

export const getAllowedPickerFromZone = (state, getters) => id => {
  const zoneColor = getters.getColorFromZone(id)
  const grey = color(zoneColor).greyscale().toString()
  const allowedPicker = state.ids.zones[id].allowedPicker

  if (zoneColor !== grey && allowedPicker.length > 1) {
    return ['wheel', 'slider', 'swatches']
  }

  return state.ids.zones[id].allowedPicker
}

export const getActivePickerFromZone = (state) => (id) => {
  return state.ids.zones[id].picker
}

export const isWhiteTemperatureZone = state => id => {
  return (state.ids.zones[id].common.mslZoneType === 'fullColor' || state.ids.zones[id].common.mslZoneType === 'fullColor8Zone')
}
