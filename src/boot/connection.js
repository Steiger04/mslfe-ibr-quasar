import Vue from 'vue'
import axios from 'axios'
import { Loading } from 'quasar'
import servConn from 'src/ws/conn-neu.js'

// "async" is optional
export default async ({ store }) => {
  Loading.show()

  let WS_PORT
  let debounceTime

  if (process.env.DEV) {
    WS_PORT = 8082
  } else {
    const URL = document.location.href.split('/').slice(0, 3).join('/')
    const data = (await axios.get(URL + '/options')).data

    WS_PORT = data.port
    debounceTime = data.debounceTime

    store.dispatch('msladapter/setDebounceTime', debounceTime)
  }

  // eslint-disable-next-line no-unused-vars
  let allIds = await new Promise((resolve, reject) => {
    servConn.init(
      {
        // name: 'milight-smart-light.0',
        connLink: 'http://' + document.domain + ':' + WS_PORT,
        socketSession: '', // optional - used by authentication
        subscribePattern: [
          'milight-smart-light.*',
          'system.adapter.milight-smart-light.*.alive',
          'system.adapter.milight-smart-light.*.connected'
        ]
      },
      {
        onConnChange: async function (isConnected) {
          if (isConnected) {
            resolve({
              groups: await getAll('device', 'milight-smart-light'),
              zones: await getAll('channel', 'milight-smart-light'),
              states: await getAll('state', 'milight-smart-light'),
              statevalues: await getAll('statevalue', 'milight-smart-light'),
              adminstates: await getAll('state', 'system.adapter.milight-smart-light'),
              adminstatevalues: await getAll('statevalue', 'system.adapter.milight-smart-light')
            })
          } else {
            Vue.$log.debug('disconnected')
          }
        },
        onUpdate: function (id, state) {
          if (state && state.ack) {
            store.dispatch('msladapter/setState', { id, state })

            if (id.split('.')[0] !== 'system') {
              Vue.$log.debug('NEW VALUE of ID --> ' + id + ': ' + JSON.stringify(state, null, '|'))
            }
          }
        }
      }
    )
  }).catch(err => Vue.$log.error('[middleware:connection]: ' + err))

  Object.assign(allIds.statevalues, allIds.adminstatevalues)
  // noinspection JSUnresolvedFunction
  store.dispatch('msladapter/setAllMslids', allIds)

  let instances = (await Promise.all(store.getters['msladapter/getInstanceNames'].map(instance => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line handle-callback-err
      servConn._socket.emit('getObject', instance, function (err, res) {
        resolve(res)
      })
    })
  }))).map(val => [
    val._id.split('.').slice(2).join('.'),
    Object.assign(val, { instance_id: val._id.split('.').splice(2).join('.') })])

  store.dispatch('msladapter/setInstances', Object.fromEntries(instances))
  Loading.hide()
}

// eslint-disable-next-line no-unused-vars
async function getAll (type, ids) {
  return new Promise((resolve, reject) => {
    if (type === 'statevalue') {
      servConn.getStates(ids + '*', function (err, _statevalues) {
        if (err) {
          reject(err)
        }

        resolve(_statevalues)
      })
    } else {
      servConn._socket.emit(
        'getObjectView',
        'system',
        type,
        {
          startkey: ids + '.',
          endkey: ids + '.\u9999'
        },
        function (err, values) {
          if (err) {
            reject(err)
          }

          const _values = {}
          for (let i = 0; i < values.rows.length; i++) {
            _values[values.rows[i].id] = values.rows[i].value
          }
          resolve(_values)
        }
      )
    }
  })
}
