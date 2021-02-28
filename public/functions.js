var state = {},
daftarKlinik = ['penyakit_dalam', 'anak', 'obgyn', 'bedah', 'gigi', 'umum'],

randomId = () => [1, 1].map(() =>
  Math.random().toString(36).slice(2)
).join(''),

poster = (url, obj, cb) => fetch(url, {
  method: 'POST', body: JSON.stringify(obj),
  headers: {'Content-Type': 'application/json'}
}).then(res => res.json()).then(cb),

tds = array =>
  array.map(i => m('td', i)),

hari = (timestamp, hour) =>
  timestamp && moment(timestamp)
  .format('Do MMMM YYYY'+(hour ? ', hh:mm' : '')),

lookUser = id =>
  !id ? '-' : _.get((state.dokterList || [])
  .find(i => i._id === id), 'nama') || '-'

