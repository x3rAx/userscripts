// ==UserScript==
// @name        Wiki(pedia) Mobile Mode
// @version     1.0
// @author      ^x3ro
// @namespace   https://x3ro.net/
//
// @description 
//
// @homepage    https://github.com/x3rAx/userscripts
// @supportURL  https://github.com/x3rAx/userscripts/issues
// @downloadURL https://cdn.jsdelivr.net/gh/x3rAx/userscripts@master/scripts/wiki-mobile-mode.user.js
//
// @match       https://*.wikipedia.org/wiki/*
// @match       https://*.wikibooks.org/wiki/*
// @grant       none
// ==/UserScript==

class ImmutableURL
{

    constructor(urlString)
    {
        this._url = new URL(urlString)
    }

    get searchParams()
    {
        const self = this
        return {
            get(key) { return self._url.searchParams.get(key) },
            set(key, value) { return self._mutate(url => url.searchParams.set(key, value)) },
            append(key, value) { return self._mutate(url => url.searchParams.append(key, value)) },
        }
    }
  
    get href() { return this._url.href }
  
    get host() { return this._url.host }
  
    setHost(host)
    {
        return this._mutate(url => url.host = host)
    }

    _mutate(cb)
    {
        const url = new URL(this._url.href)
        cb(url)
        return new this.constructor(url.href)
    }
    
}


!(function() {
    // TODO: Replace the "Show Desktop" button with logic to toggle to desktop

    const url = new ImmutableURL(document.location.href)
    
    const hostSplit = url.host.split('.')
    const domainPos = hostSplit.length -2 // tld = -1, domain = -2
    const isMobile = (hostSplit[domainPos -1] === 'm')

    if (isMobile) return

    document.body.style.display = 'none'

    if (sessionStorage.getItem('handleOnReturn') === 'yes') {
        if (url.searchParams.get('onReturn') === 'back') {
            const newUrl = url.searchParams.set('onReturn', 'forward')
            history.replaceState(null, '', newUrl.href)
            history.go(-1)
            return
        }
        if (url.searchParams.get('onReturn') === 'forward') {
            const newUrl = url.searchParams.set('onReturn', 'back')
            history.replaceState(null, '', newUrl.href)
            history.go(+1)
            return
        }
    }

    const newUrl = url.searchParams.append('onReturn', 'back')
    history.replaceState(null, '', newUrl.href)

    sessionStorage.setItem('handleOnReturn', 'yes')

    hostSplit.splice(domainPos, 0, 'm')
    const mobileUrl = url.setHost(hostSplit.join('.'))
    document.location.href = mobileUrl.href
})()
