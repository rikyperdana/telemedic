var state = {},
daftarKlinik = ['penyakit_dalam', 'anak', 'obgyn', 'bedah', 'gigi', 'umum'],

randomId = () => [1, 1].map(() =>
  Math.random().toString(36).slice(2)
).join(''),

poster = (url, obj, cb) => fetch(url, {
  method: 'POST', body: JSON.stringify(obj),
  headers: {'Content-Type': 'application/json'}
}).then(res => res.json()).then(cb)

m.mount(document.body, mitGen({
  brand: { // only have 1 menu
    name: 'home', full: 'SIMRS.dev',
    // comp: () => m('h1', 'Home')
  },
  start: { // may have menus of menus
    telemedic: {icon: 'headset', comp: () => [
      m('h2', 'Riwayat Telemedic'),
      m('.button.is-info',
        {onclick: () => [
          state.modalRequestTelemed = m('.box',
            m('h4', 'Form permintaan daring Dokter'),
            m(autoForm({
              id: 'formRequestTelemed', action: console.log,
              layout: {top: [
                ['klinik', 'dokter'],
                ['pesan'], ['darurat'],
                ['idrawat', 'request']
              ]},
              schema: {
                klinik: {type: Number, autoform: {
                  type: 'select', options: () => daftarKlinik.map(
                    (val, key) => ({value: key+1, label: _.startCase(val)})
                  )
                }},
                dokter: {type: String},
                pesan: {type: String, autoform: {type: 'textarea'}},
                darurat: {type: Number, autoform: {
                  type: 'select', options: () => [
                    {value: 1, label: 'Ya'},
                    {value: 2, label: 'Tidak'}
                  ]
                }},
                idrawat: {
                  type: String, autoValue: () => randomId(),
                  autoform: {type: 'hidden'}
                },
                request: {
                  type: Number,
                  autoform: {type: 'hidden'},
                  autoValue: () => _.now()
                }
              }
            }))
          ),
          m.redraw()
        ]},
        makeIconLabel('plus', 'Request Dokter')
      ),
      makeModal('modalRequestTelemed')
    ]}
  },
  end: { // may have 1 submenu menu
    name: 'user', full: 'User Menu',
    comp: () => m('h1', 'User Profile'),
    submenu: {
      login: {full: 'Sign In/Up', icon: 'sign-in-alt'},
      profile: {
        icon: 'address-card',
        comp: () => m('h1', 'My Profile')
      },
      subs: {full: 'Subscription', icon: 'rss'},
      logout: {icon: 'sign-out-alt'}
    }
  },
}, {
  theme: 'united'
}))
