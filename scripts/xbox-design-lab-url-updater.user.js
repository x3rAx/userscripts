// ==UserScript==
// @name        Xbox Design Lab (Controller Designer) Url Updater
// @version     1.0
// @author      ^x3ro
// @namespace   https://x3ro.net/
//
// @description Update page url when changing the controller design so that the url can be bookmarked or shared
//
// @homepage    https://github.com/x3rAx/userscripts
// @supportURL  https://github.com/x3rAx/userscripts/issues
// @downloadURL https://cdn.jsdelivr.net/gh/x3rAx/userscripts@master/scripts/xbox-design-lab-url-updater.user.js
//
// @include     /^https://www.microsoft.com/[^/]*/store/configure/xbox-design-lab/.*$/
// @grant       none
// ==/UserScript==

const buttons = document.querySelectorAll('button[data-pid][data-sid]')

buttons.forEach(x => x.addEventListener('click', ev => {
    const pid = ev.target.getAttribute('data-pid')
    const sid = ev.target.getAttribute('data-sid')

    const url = new URL(location)
    const config = getConfigFromUrl(url)
    
    config[pid] = sid
    
    setConfigToUrl(url, config)
    window.history.pushState({},"", url.toString());
}))

function parseConfigStr(configStr) {
    if (configStr === null || configStr === "") return {}
    
    const kvPairs = configStr.split(',').map(x => x.split(':'))
    return Object.fromEntries(kvPairs)
}

function buildConfigStr(config) {
    return Object.entries(config)
        .map(x => x.join(':'))
        .join(',')
}

function getConfigFromUrl(url) {
    const configStr = url.searchParams.get('selectedskus')
    return parseConfigStr(configStr)
}

function setConfigToUrl(url, config) {
    const configStr = buildConfigStr(config)
    url.searchParams.set('selectedskus', configStr)
}
