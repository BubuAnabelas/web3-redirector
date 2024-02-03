import Resolution, {
  ResolutionError,
  ResolutionErrorCode,
} from '@unstoppabledomains/resolution'

const resolution = new Resolution({
  sourceConfig: {
    uns: {
      locations: {
        Layer1: {url: 'https://endpoints.omniatech.io/v1/eth/mainnet/publicrpc', network: 'mainnet'},
        Layer2: {url: 'https://endpoints.omniatech.io/v1/matic/mainnet/publicrpc', network: 'polygon-mainnet'}
      }
    },
    ens: {
      url: 'https://endpoints.omniatech.io/v1/eth/mainnet/publicrpc',
      network: 'mainnet'
    }
  }
});

export async function redirectToDNSAddressRecord(domain: string, tabId: number) {
  
  const url = new URL(domain)
  const records = await resolution.records(url.hostname, ['browser.redirect_url'])
  if (!records || !records['browser.redirect_url']) {
    throw new ResolutionError(ResolutionErrorCode.RecordNotFound, {
      recordName: 'browser.redirect_url',
      domain: domain,
    });
  }

  return chrome.tabs.update(tabId, {
    url: records['browser.redirect_url'],
  })
}

export async function getAllRecords(domain: string) {
  const records = await resolution.allRecords(domain)
  return records;
}


//domain names supported
export const supportedDomains: string[] = [
  '.crypto',
  '.nft',
  '.wallet',
  '.bitcoin',
  '.x',
  '.888',
  '.dao',
  '.blockchain',
  '.zil',
  '.hi',
  '.klever',
  '.kresus',
  '.polygon',
  '.anime',
  '.manga',
  '.binanceus',
  '.go',
  '.altimist',
  '.unstoppable',
  '.eth'
]

//return true if url ends in one of the supported domains
export const supportedDomain = (q: string): boolean => supportedDomains.some((d: string): boolean => q.endsWith(d))
