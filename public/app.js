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
        last => last ? ors([ // munculkan kalau request terakhir:
          last.soapDokter, // sudah ada soapDokternya
          last.konfirmasi === 2 // ditolak pendaftaran
        ]) : true
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
              confirmMessage: 'Yakin untuk kirimkan ke pasien?',
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
        m('thead', m('tr', ['Tanggal', 'DPJP'].map(i => m('th', i)))),
        m('tbody', withThis(
          _.get(JSON.parse(localStorage.patient), 'telemed'),
          telemedList => (telemedList || []).map(i => m('tr',
            {onclick: () => [
              state.modalRincianTelemed = m('.box',
                m('h4', 'Rincian Telemed'),
                m('.table-container', m('table.table',
                  [
                    ['Konfirmasi', i.konfirmasi === 1 ? 'Diterima' : 'Ditolak'],
                    ['Jadwal live', hari(i.tanggal, true)],
                    ['Keterangan', i.keterangan],
                    ['Klinik', daftarKlinik[i.klinik - 1]],
                    ['Dokter diminta', lookUser(i.dokter)],
                  ].map(j => m('tr', m('th', j[0]), m('td', j[1])))
                )),
                ands([i.link, _.now() > i.tanggal, !i.soapDokter]) &&
                m('.button.is-primary', m('a',
                  {href: i.link, target: '_blank', style: 'color: inherit'},
                  makeIconLabel('headset', 'Join live')
                ))
              ),
              m.redraw()
            ]},
            tds([hari(i.request, true), lookUser(_.get(i, 'soapDokter.dokter'))])
          ))
        )),
        makeModal('modalRincianTelemed')
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
      logout: {icon: 'sign-out-alt', comp: () => [
        localStorage.removeItem('patient'),
        m.redraw()
      ]}
    }
  },
}

m.mount(document.body, mitGen(menus, {theme: 'united'}))
