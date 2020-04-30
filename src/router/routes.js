const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutBridge.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PageBridge.vue'),
        props: true,
        beforeEnter: (to, from, next) => {
          if (!from.params.instanceId) {
            to.params.instanceId = to.meta.store.getters['msladapter/getInstancesAsArray'][0].instance_id
          } else {
            to.params.instanceId = from.params.instanceId
            // to.params.zoneId = from.params.zoneId
          }

          next()
        }
      },
      {
        path: ':zoneId',
        component: () => import('layouts/LayoutZone.vue'),
        props: true,
        beforeEnter: (to, from, next) => {
          if (to.meta.store.state.msladapter.ids.zones[to.params.zoneId] === undefined) {
            next({ path: '/', replace: true })
          } else {
            to.params.instanceId = to.params.zoneId.split('.').slice(0, 2).join('.')
            next()
          }
        },
        children: [
          {
            path: '',
            component: () => import('pages/PageZone.vue'),
            props: true
          }
        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    redirect: '/'
    /* component: () => import('pages/Error404.vue') */
  })
}

export default routes
