var ac = require('async-console')
;(typeof global?global.acDebug = true:window.acDebug = true)
// https://nodejs.org/api/globals.html
function query(attrs, data) {
        ac.group('query.js')
        ac.$input('query', attrs, data)
    function getQueryArray(attrs) {
        return attrs.split(',')
    }

        ac.group('getQueryArray')
        ac.$input('getQueryArray', attrs)
    var queryArray = getQueryArray(attrs)
        ac.$output('getQueryArray', queryArray)
        ac.groupEnd()

        ac.groupCollapsed('queryArray.forEach(setKey)')
    var output = {}
    queryArray.forEach(function setKey(key) {
        ac.log(`output["${key}"] = `, `"${data[key]}"`)
        output[key] = data[key]
    })
        ac.groupEnd()

        ac.$output('query', output)
        ac.$show()
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
