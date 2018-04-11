var dc = require('delay-console')
;(typeof global?global.dcDebug = true:window.dcDebug = true)
// https://nodejs.org/api/globals.html
function query(attrs, data) {
    /**/
    dc.group('query.js')
    dc.$input('query', attrs, data)
    /**/
    function getQueryArray(attrs) {
        return attrs.split(',')
    }
    /**/
    dc.group('getQueryArray')
    dc.$input('getQueryArray', attrs)
    /**/
    var queryArray = getQueryArray(attrs)
    /**/
    dc.$output('getQueryArray', queryArray)
    dc.groupEnd()
    dc.groupCollapsed('queryArray.forEach(setKey)')
    /**/
    var output = {}
    queryArray.forEach(function setKey(key) {
        /**/
        dc.log(`output["${key}"] = `, `"${data[key]}"`)
        /**/
        output[key] = data[key]
    })
    /**/
    dc.groupEnd()
    dc.$output('query', output)
    dc.groupEnd()
    dc.$show()
    /**/
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

dc.groupCollapsed('more options')
dc.$json(
    'object & array',
    {
        name: 'nimo',
        skills: [
            'html',
            'css',
            'js'
        ]
    },
    [
        'abc',
        '123',
        '一二三四'
    ]
)
dc.$inputJson('query', ['abc', '1234'], {name: 'nimo'})
dc.$outputJson('query', {some: '123'})
dc.$show()
