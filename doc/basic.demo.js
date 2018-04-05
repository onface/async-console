var ac = require('async-console')
;(typeof global?global.acDebug = true:window.acDebug = true)
// https://nodejs.org/api/globals.html

function query(attrs) {
    ac.group('query.js')
    ac.$input('query', attrs)
    function getQueryString(attrs) {
        return attrs.join(',')
    }
    ac.group('getQueryString')
    ac.$input('getQueryString', attrs)
    var queryString = getQueryString(attrs)
    ac.$output('getQueryString', queryString)
    ac.groupEnd()
    // ac.$show()
    setTimeout(function () {
        ac.info('You can choose to asynchronous or synchronous')
        ac.$show()
    }, 100)

}

query(['a', 'b', 'c'])
