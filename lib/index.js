var extend = require('safe-extend')
var fecha = require('fecha')
if (typeof global === 'undefined') {

}
module.exports = function (name, debug) {
    var log = {
        data: [],
        add: function (...arg) {
            arg = arg.map(function (msg) {
                if (typeof msg === 'object') {
                    msg = extend.clone(msg)
                }
                return msg
            })
            arg = [`[${fecha.format(new Date(), 'hh:mm:ss.SSSS')}]`].concat(arg)
            this.data.push(arg)
            return this
        },
        end: function () {
            global = typeof global === 'undefined'?window:global
            if (!global.historyLogDebug) {
                return
            }
            console.group(name)
            this.data.forEach(function (arg) {
                console.log.apply(null, arg)
            })
            console.groupEnd()
        }
    }
    return log
}
