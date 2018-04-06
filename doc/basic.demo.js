var dc = require('delay-console')
;(typeof global?global.dcDebug = true:window.dcDebug = true)
// https://nodejs.org/api/globals.html
function query(attrs, data) {
        dc.group('query.js')
        dc.$input('query', attrs, data)
    function getQueryArray(attrs) {
        return attrs.split(',')
    }

        dc.group('getQueryArray')
        dc.$input('getQueryArray', attrs)
    var queryArray = getQueryArray(attrs)
        dc.$output('getQueryArray', queryArray)
        dc.groupEnd()

        dc.groupCollapsed('queryArray.forEach(setKey)')
    var output = {}
    queryArray.forEach(function setKey(key) {
        dc.log(`output["${key}"] = `, `"${data[key]}"`)
        output[key] = data[key]
    })
        dc.groupEnd()

        dc.$output('query', output)
        dc.$show()
    return output
}

query(
    'a,b,c',
    {
        a: 'nimo',
        b: 'nico',
        c: 'tim',
        d: 'bob',
        e: 'lisa'
    }
)
