import { prettyPrintJson } from 'pretty-print-json';
import { getAllRecords } from '../util/helpers'

const urlParams = new URLSearchParams(window.location.search);
document.getElementById('url')!.innerText = `${urlParams.get('url')} not found`
getAllRecords(urlParams.get('url')!!).then(recs => {
  document.getElementById('root')!.innerHTML = prettyPrintJson.toHtml(recs)
})