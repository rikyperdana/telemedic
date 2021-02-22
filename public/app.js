var menus = {
  brand: { // only have 1 menu
    name: 'home', full: 'SIMRS.dev',
    // comp: () => m('h1', 'Home')
  },
  start: { // may have menus of menus
    telemedic: {icon: 'headset', comp: () =>
    !JSON.parse(localStorage.patient || '{}')._id
    ? [mgState.comp = menus.end.submenu.login.comp, m.redraw()]
    : [
      m('h2', {
        oncreate: () => poster('/dokterList', {}, res => [
          state.dokterList = res.res, m.redraw()
        ])
      }, 'Riwayat Telemedic'),
      !withThis(
        _.last(_.get(JSON.parse(localStorage.patient), 'telemed')),
        last => ors([ // munculkan kalau request terakhir:
          last.soapDokter, // sudah ada soapDokternya
          last.konfirmasi === 2 // ditolak pendaftaran
        ])
      ) ? m('p.help', '* Menunggu respon rumah sakit')
      : m('.button.is-info',
        {onclick: () => [
          state.modalRequestTelemed = m('.box',
            m('h4', 'Form permintaan daring Dokter'),
            m(autoForm({
              id: 'formRequestTelemed',
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
                dokter: {type: String, autoform: {
                  type: 'select', options: () => state.dokterList.map(
                    i => ({value: i._id, label: i.nama})
                  )
                }},
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
              },
              action: doc => poster('/updatePatient',
                withThis(
                  JSON.parse(localStorage.patient),
                  patient => _.assign(patient, {
                    telemed: [...(patient.telemed || []), doc],
                    updated: _.now()
                  })
                ),
                res => res && [
                  state.modalRequestTelemed = null,
                  m.redraw()
                ]
              )
            }))
          ),
          m.redraw()
        ]},
        makeIconLabel('plus', 'Request Telemedik')
      ),
      makeModal('modalRequestTelemed'), m('br'), m('br'),
      m('.box', m('.table-container', m('table.table',
        m('thead', m('tr', ['Tanggal', 'Dokter'].map(i => m('th', i)))),
        m('tbody', withThis(
          _.get(JSON.parse(localStorage.patient), 'telemed'),
          telemedList => telemedList.map(i => m('tr', tds([
            hari(i.tanggal, true), lookUser(_.get(i, 'soapDokter.dokter'))
          ])))
        ))
      )))
    ]},
    outpatient: {full: 'Rawat Jalan', icon: 'walking'},
    riwayat: {full: 'Riwayat Kunjungan', icon: 'book-medical'},
    dokter: {full: 'Daftar Dokter', icon: 'user-md'},
    profil: {full: 'Update Profil', icon: 'id-card'}
  },
  end: { // may have 1 submenu menu
    name: 'user', full: 'User Menu',
    comp: () => m('h1', 'User Profile'),
    submenu: {
      login: {
        full: 'Sign In/Up', icon: 'sign-in-alt',
        comp: () => m('.columns',
          m('.column'),
          m('.column',
            _.range(3).map(i => m('br')),
            m('.level', m('.level-item.has-text-centered',
              m('span.icon.is-large.has-text-primary', m('i.fas.fa-8x.fa-stethoscope'))
            )), m('br'),
            m(autoForm({
              id: 'loginForm',
              schema: {
                username: {type: String},
                password: {type: String, autoform: {type: 'password'}}
              },
              submit: {value: 'Login'},
              action: doc => poster('/login', doc, res =>
                res.error ? alert(_.startCase(res.error)) : [
                  localStorage.setItem('patient', JSON.stringify(res)),
                  mgState.comp = menus.start.telemedic.comp,
                  m.redraw()
                ]
              )
            }))
          ),
          m('.column')
        )
      },
      profile: {
        icon: 'address-card',
        comp: () => m('h1', 'My Profile')
      },
      subs: {full: 'Subscription', icon: 'rss'},
      logout: {icon: 'sign-out-alt'}
    }
  },
}

m.mount(document.body, mitGen(menus, {theme: 'united'}))
