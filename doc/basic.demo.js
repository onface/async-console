var hlog = require('history-log')

var log = hlog('some')
log.add('message 1')
log.add({name: 'nimo'})
setTimeout(function () {
    log.add('message 3')
    log.end()
}, 500)
/*
some
28:08.7027| message 1
28:08.7037| {name: "nimo"}
28:09.2052| message 3
*/
