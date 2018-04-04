var extend = require('safe-extend')
var fecha = require('fecha')
module.exports = function (name) {
    var log = {
        data: [],
        add: function (...arg) {
            arg = arg.map(function (msg) {
                if (typeof msg === 'object') {
                    msg = extend.clone(msg)
                }
                return msg
            })
            arg = [fecha.format(new Date(), 'mm:ss.SSSS') + '|'].concat(arg)
            this.data.push(arg)
        },
        end: function () {
            console.group(name)
            this.data.forEach(function (arg) {
                console.log.apply(null, arg)
            })
            console.groupEnd()
        }
    }
    return log
}
