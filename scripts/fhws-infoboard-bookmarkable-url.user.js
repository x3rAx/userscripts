// ==UserScript==
// @name        Bookmarkable FHWS Infoboard URL
// @author      ^x3ro
// @namespace   https://x3ro.net/
// @version     1.0
//
// @description Update URL of FHWS Infoboard when updating the search filter so it can be bookmarked or shared.
//
// @homepage    https://github.com/x3rAx/userscripts
// @supportURL  https://github.com/x3rAx/userscripts/issues
// @downloadURL https://rawgit.com/x3rAx/userscripts/master/scripts/fhws-infoboard-bookmarkable-url.user.js
//
// @match       https://infoboard.fhws.de/
// @grant       none
// ==/UserScript==


const COURSES_URL_SEPARATOR = '_!_'


function updateUrl(site, courses) {
    const allCourses = unsafeWindow.arrCourse
    
    const url = new URL(location.href)
    
    url.searchParams.delete('ort')
    url.searchParams.delete('stu')
    
    if (site !== '') {
        url.searchParams.set('ort', site)
    }
    
    if (courses.length !== allCourses.length) {
        url.searchParams.set('stu', makeCoursesUrlValue(courses))
    }

    history.pushState(null, '', url.href)
}


function makeCoursesUrlValue(courses) {
    if (courses.length === 0) {
        return '-'
    }
    return courses.join(COURSES_URL_SEPARATOR)
}


function getSelectedCourses() {
    const allCourses = unsafeWindow.arrCourse
    const allCoursesSelectState = unsafeWindow.arrCourseTest
    
    return allCourses
        .filter((course, idx) => allCoursesSelectState[idx] === true)
}


unsafeWindow.arrSelect = new Proxy(unsafeWindow.arrSelect, {
    set: (target, property, value, receiver) => {
        //console.log({target, property, value, receiver})
        target[property] = value
        
        const [date, site, coursesStr] = target
        const selectedCourses = getSelectedCourses()
        
        updateUrl(site, selectedCourses)
    }
})
