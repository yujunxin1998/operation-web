export function base64Encode (input) {
    var rv
    rv = encodeURIComponent(input)
    rv = unescape(rv)
    rv = window.btoa(rv)
    return rv
}

export function base64Decode (input) {
    var rv
    rv = window.atob(input)
    rv = escape(rv)
    rv = decodeURIComponent(rv)
    return rv
}
