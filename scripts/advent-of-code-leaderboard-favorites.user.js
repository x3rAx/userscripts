// ==UserScript==
// @name        Advent of Code - Leaderboard Favorite
// @author      ^x3ro
// @namespace   https://x3ro.net/
// @version     1.0
//
// @description Add a quick link to your favorite private leaderboard
//
// @homepage    https://github.com/x3rAx/userscripts
// @supportURL  https://github.com/x3rAx/userscripts/issues
// @downloadURL https://cdn.jsdelivr.net/gh/x3rAx/userscripts@master/scripts/advent-of-code-leaderboard-favorites.user.js
//
// @match       https://adventofcode.com/*
// @grant       none
// ==/UserScript==

const ICON_FAV = '⭐'
const ICON_PRIVATE = '🕵'

const LOCAL_STORAGE_LEADERBOARD_FAV_URL = 'leaderBoardFavUrl'

const STYLE_FAV_DISABLED = {
    color: 'transparent',
    textShadow: '0 0 0 silver',
}

const STYLE_EMOJI_LINK =  {
    color: 'transparent',
    textShadow: '0 0 0 #009900',
    marginLeft: '0.3em',
}

const addLeaderboardFavToggle = (viewLink) => {
    const board = viewLink.parentElement
    const url = viewLink.href
    
    const currentFavUrl = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_FAV_URL)
    const favLink = createLink(`${ICON_FAV} `, '#')
    favLink.addEventListener('click', ev => toggleFav(url))
    
    if (url !== currentFavUrl) {
        applyStyle(favLink, STYLE_FAV_DISABLED)
    }
    
    board.prepend(favLink)
}

const toggleFav = (url) => {
    const currentFavUrl = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_FAV_URL)
    localStorage.removeItem(LOCAL_STORAGE_LEADERBOARD_FAV_URL)
    if (url !== currentFavUrl) {
        localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_FAV_URL, url)
    }
    location.reload()
}

const addLeaderboardLinks = (link) => {
    const currentFavUrl = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_FAV_URL)
    
    const privLink = createLink(ICON_PRIVATE, link.href + '/private', STYLE_EMOJI_LINK)
    link.parentElement.append(privLink)
    
    if (currentFavUrl === null) {
        return
    }
    
    const favLink = createLink(ICON_FAV, currentFavUrl, STYLE_EMOJI_LINK)
    link.parentElement.append(favLink)
}

const applyStyle = (elem, style) => {
    for (s in style) {
        elem.style[s] = style[s]
    }
}

const createLink = (text, href, style = {}) => {
    const link = document.createElement('a')
    link.href = href
    link.append(document.createTextNode(text))
    applyStyle(link, style)
    return link
}

document
    .querySelectorAll('main a[href*="/leaderboard/private/view/"]')
    .forEach(addLeaderboardFavToggle)

document
    .querySelectorAll('a[href$="/leaderboard"]')
    .forEach(addLeaderboardLinks)
