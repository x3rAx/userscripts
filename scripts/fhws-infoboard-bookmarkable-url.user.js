// ==UserScript==
// @name        Bookmarkable FHWS Infoboard URL
// @author      ^x3ro
// @namespace   https://x3ro.net/
// @version     2.0
//
// @description Update URL of FHWS Infoboard when updating the search filter so it can be bookmarked or shared.
//
// @homepage    https://github.com/x3rAx/userscripts
// @supportURL  https://github.com/x3rAx/userscripts/issues
// @downloadURL https://cdn.jsdelivr.net/gh/x3rAx/userscripts@master/scripts/fhws-infoboard-bookmarkable-url.user.js
//
// @match       https://infoboard.fhws.de/
// @grant       none
// ==/UserScript==

const URL_PARAM_SITE = '--site'
const URL_PARAM_COURSES = '--courses'
const ALL_COURSES = unsafeWindow.arrCourse
    

function updateUrl(site, courses) {
    const url = new URL(location.href)
    
    url.searchParams.delete(URL_PARAM_SITE)
    url.searchParams.delete(URL_PARAM_COURSES)
    
    if (site !== '') {
        setRawUrlSearchParam(url, URL_PARAM_SITE, site)
    }
    
    if (courses.length !== ALL_COURSES.length) {
        setRawUrlSearchParam(url, URL_PARAM_COURSES, makeCoursesUrlValue(courses))
        // url.searchParams.set(URL_PARAM_COURSES, makeCoursesUrlValue(courses))
    }

    history.pushState(null, '', url.href)
}


function setRawUrlSearchParam(url, key, value) {
    url.searchParams.delete(key)
    const prefix = (url.search === '' ? '?' : '&')
    url.search += `${prefix}${key}=${value}`
}


function getRawUrlSearchParam(url, key) {
    const searchStr = url.search.slice(1) // Remove '?' at beginning
    const searchParams = searchStr.split('&')

    for (searchParam of searchParams) {
        const [paramKey, paramVal] = searchParam.split('=')
        if (paramKey === key) {
            return paramVal
        }
    }

    return null
}


function makeCoursesUrlValue(courses) {
    return courses
        .map(encodeURIComponent)
        .join(',')
    // return JSON.stringify(courses.map(encodeURIComponent))
}


function getSelectedCourses() {
    const allCoursesSelectState = unsafeWindow.arrCourseTest
    
    return ALL_COURSES
        .filter((course, idx) => allCoursesSelectState[idx] === true)
}


function updatePage(site, selectedCourses) {
    const allCoursesSelectState = unsafeWindow.arrCourseTest
    const filteredSelectedCourses = new Set()

    for (const idx in ALL_COURSES) {
        const course = ALL_COURSES[idx]
        const isSelected = selectedCourses.includes(course)

        allCoursesSelectState[idx] = isSelected
        filteredSelectedCourses.add(course)
    }

    let encodedCourses = selectedCourses.join('#')

    // The renderer shows "All Courses" when the string encodes one more course
    // than there actually are instead of just checking if the number of encoded
    // courses matches the number of all courses... *facepalm*
    if (selectedCourses.length === ALL_COURSES.length) {
        encodedCourses += "#"
    }

    unsafeWindow.arrSelect[1] = site
    unsafeWindow.arrSelect[2] = encodedCourses

    // if (selectedCourses.length === 0) {
    //     unsafeWindow.arrSelect[2] = '-'
    // }
    unsafeWindow.fillCalendar(unsafeWindow.arrSelect[0], site, encodedCourses)
}


const url = new URL(location.href)

const site = url.searchParams.get(URL_PARAM_SITE) ?? ''
const courses = getRawUrlSearchParam(url, URL_PARAM_COURSES)
    ?.split(',')
    .map(decodeURIComponent)
    ?? ALL_COURSES.filter((course, idx) => unsafeWindow.arrCourseTest[idx] === true)

updatePage(site, courses)

unsafeWindow.arrSelect = new Proxy(unsafeWindow.arrSelect, {
    set: (target, property, value, receiver) => {
        //console.log({target, property, value, receiver})
        target[property] = value
        
        const [date, site, coursesStr] = target
        const selectedCourses = getSelectedCourses()
        
        updateUrl(site, selectedCourses)
    }
})
