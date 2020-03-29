// ==UserScript==
// @name login2.me Copy to Clipboard
// @author ^x3ro
// @namespace https://x3ro.net/
// @version 1.0
//
// @description Search current query with other search engines.
// @homepage https://github.com/x3rAx/userscripts
// @supportURL https://github.com/x3rAx/userscripts/issues
// @downloadURL https://cdn.jsdelivr.net/gh/x3rAx/userscripts@master/scripts/login2me-clipboard.user.js
//
// @include /^http:\/\/login2.me\/.*/
// @grant none
// ==/UserScript==

'use strict'

const TXT_COPY = 'COPY'
const TXT_COPIED = 'COPIED'

function copyToClipboard(str) {
    const $textarea = document.createElement('textarea')
    $textarea.value = str
    document.body.appendChild($textarea)
    $textarea.select()
    document.execCommand('copy')
    document.body.removeChild($textarea)
}

function selectText($element) {
    var range = document.createRange();
    range.selectNode($element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

function handleEvent(cb) {
    return (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        cb(ev)
    }
}

function addCopyButton($element) {
    const $btnCopy = document.createElement('button')

    $element.style.float = 'left'
    $element.style.marginRight = '10px'

    
    $btnCopy.style.width = '100px'
    $btnCopy.style.height = '25px'

    $btnCopy.innerText = TXT_COPY

    $btnCopy.addEventListener('click', handleEvent((e) => {
        // Select text asynchronously. Does not work synchronously for some reason. ¯\_(ツ)_/¯
        setTimeout(() => selectText($element), 0)
        copyToClipboard($element.innerText)

        $btnCopy.innerText = TXT_COPIED

        setTimeout(() => $btnCopy.innerText = TXT_COPY, 2000)
    }))

    $element.parentElement.appendChild($btnCopy)
}

const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            const $login = mutation.target.querySelector('#login')
            const $password = mutation.target.querySelector('#password')

            if ($login) {
                addCopyButton($login)
            }

            if ($password) {
                addCopyButton($password)
            }
        }
    }
})

observer.observe(
    document.querySelector('#acc_form'),
    {childList: true}
)
