// ==UserScript==
// @name        ZSA Configurator - Copy Layer Helper
// @author      ^x3ro
// @namespace   https://userscripts.x3ro.dev/
// @version     1.0
//
// @description Add a quick link to your favorite private leaderboard
//
// @homepage    https://github.com/x3rAx/userscripts
// @supportURL  https://github.com/x3rAx/userscripts/issues
// @downloadURL https://cdn.jsdelivr.net/gh/x3rAx/userscripts@master/scripts/advent-of-code-leaderboard-favorites.user.js
//
// @match       https://configure.zsa.io/moonlander/layouts/*/*/*
// @grant       none
// ==/UserScript==

const buildHeaders = () => {
    const jwtToken = localStorage.jwtToken
    return {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "content-type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
    }
}

const fetchLayout = async ({geometry, layoutId, revisionId = "latest"}) => {
    const body = {
        operationName: "getLayout",
        variables: {
            hashId: layoutId,
            geometry,
            revisionId,
        },
        query: `
            query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
                Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
                    ...LayoutData
                    __typename
                }
            }

            fragment LayoutData on Layout {
                privacy
                geometry
                hashId
                parent {
                    hashId
                    __typename
                }
                tags {
                    id
                    hashId
                    name
                    __typename
                }
                title
                user {
                    annotationPublic
                    name
                    hashId
                    pictureUrl
                    __typename
                }
                revision {
                    ...RevisionData
                    __typename
                }
                __typename
            }

            fragment RevisionData on Revision {
                aboutIntro
                aboutOutro
                createdAt
                hashId
                hexUrl
                model
                title
                config
                swatch
                zipUrl
                qmkVersion
                qmkUptodate
                layers {
                    builtIn
                    hashId
                    keys
                    position
                    title
                    color
                    __typename
                }
                __typename
            }
        `,
    }
    const response = await fetch("https://oryx.zsa.io/graphql", {
        // credentials: "include",
        headers: buildHeaders(),
        referrer: "https://configure.zsa.io/",
        body: JSON.stringify(body),
        method: "POST",
        // mode: "cors",
    })
    return await response.json()
}

const createLayer = async ({revisionHashId, keys, position}) => {
    const key_defaults = {
        about: null,
        aboutPosition: null,
        customLabel: null,
        glowColor: null,
        tap: null,
        hold: null,
        doubleTap: null,
        tapHold: null,
    }
    
    // Fill `keys` with default values
    keys = keys.map(key => ({...key_defaults, ...key}))
    
    const body = {
        operationName: null,
        variables: {
            keys,
            position,
            revisionHashId,
        },
        query: `
            mutation ($keys: Json!, $revisionHashId: String!, $position: Int!) {
                createLayer(
                    newKeys: $keys
                    revisionHashId: $revisionHashId
                    position: $position
                ) {
                    hashId
                    __typename
                }
            }
        `,
    }
    const response = await fetch("https://oryx.zsa.io/graphql", {
        // credentials: "include",
        headers: buildHeaders(),
        referrer: "https://configure.zsa.io/",
        body: JSON.stringify(body),
        method: "POST",
        // mode: "cors",
    })
    
    return await response.json()
}

const getLayoutInfoFromURL = () => {
    [geometry, , layoutId, revisionId, layer] = new URL(location.href).pathname.replace(/^[\/]*|[\/]*$/g, '').split('/')
    return { geometry, layoutId, revisionId, layer }
}

const getLastLayerPos = (layers) => {
    const lastLayer = layers.reduce((prev, current) => {
        return prev.position > current.position ? prev : current
    })
    return lastLayer.position
}

const cloneCurrentLayer = async () => {
    ({ geometry, layoutId, revisionId, layer } = getLayoutInfoFromURL())
    const layout = await fetchLayout({ geometry, layoutId, revisionId })
    const revisionHashId = layout.data.Layout.revision.hashId
    const layers = layout.data.Layout.revision.layers
    const layerKeys = layers[layer].keys
    const nextPos = getLastLayerPos(layers) + 1
    
    const result = await createLayer({
        revisionHashId,
        keys: layerKeys,
        position: nextPos,
    })
    
    if (! result.data) {
        alert("Failed to clone current layer")
        console.log(result)
        return
    }
    
    if (confirm(`Layer ${nextPos} has been created. You mus reload for changes to take effect. Reload now?`)) {
        location.reload()
    }
}

window.addEventListener('load', async () => {
    unsafeWindow.cloneCurrentLayer = cloneCurrentLayer
    // unsafeWindow.createNewBabo = async (pos) => {
    //     const layout = await fetchLayout({
    //         geometry: "moonlander",
    //         hashId: "K4nRw",
    //         revisionId: "latest",
    //     })
    //     const revisionHashId = layout.data.Layout.revision.hashId
    //     const keys = layout.data.Layout.revision.layers[0].keys
    //     debugger;
    //     return createLayer({
    //         revisionHashId: revisionHashId,
    //         keys,
    //         position: pos,
    //     })
    // }
})