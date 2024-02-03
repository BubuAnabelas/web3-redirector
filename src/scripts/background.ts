import { redirectToDNSAddressRecord, supportedDomain, supportedDomains } from '../util/helpers';
import { searchEngines, SearchEngine } from '../util/searchEngines'
import { Buffer } from "buffer"
window.Buffer = Buffer

chrome.webRequest.onBeforeRequest.addListener(
  requestDetails => {
    const url = new URL(requestDetails.url)
    const searchEngine = searchEngines.find(se => url.hostname.includes(se.hostname));
    if (!searchEngine) return

    const params = url.searchParams
      .get(searchEngine.param)?.trim()
      .toLowerCase()
    const q = new URL(url.protocol + '//' + params)

    if (!q.hostname || !supportedDomain(q.hostname)) {
      return
    }
    if (q.hostname.endsWith('.888')) {
      chrome.tabs.update(
        { url: 'index.html#loading' },
        async (tab?: chrome.tabs.Tab) => {
            await redirectToDNSAddressRecord(q.toString(), tab?.id as number)
          return { cancel: true }
        },
      )
      return {cancel: true}
    }
    chrome.tabs.update({ url: q.toString() })
    return { cancel: true }
  },
  {
    urls: searchEngines.map((se: SearchEngine): string => `*://*.${se.hostname}/*`),
    types: ['main_frame'],
  },
  ['blocking'],
)

chrome.webRequest.onBeforeRequest.addListener(requestDetails => {
  if (requestDetails.tabId !== -1) {
  	chrome.tabs.update({ url: 'index.html#loading' }, async (tab?: chrome.tabs.Tab) => {
      try {
    		await redirectToDNSAddressRecord(requestDetails.url, tab?.id as number)
  		  return { cancel: true }
      } catch(e){
        const url = new URL(requestDetails.url)
        return chrome.tabs.update(tab?.id as number, {
          url: `error.html?url=${url.hostname}`
        })
      }
  	})
  }
},
{
	urls: supportedDomains.map((d: string): string => `*://*${d}/*`),
	types: ['main_frame']
}, ['blocking'])
