var extend = require('safe-extend')
var fecha = require('fecha')
global = typeof global === 'undefined'?window:global
var proxyKeys = ['log', 'group', 'groupEnd', 'error', 'info', 'warn', 'dir', 'dirxml', 'table', 'groupCollapsed', 'count', 'assert']
var clone = function clone(item) {
    if (typeof item === 'object') {
        item = extend.clone(item)
    }
    return item
}
var aconsole = new Proxy(
    {
        _data: [],
        $show: function () {
            const self = this
            var firstTime = new Date().getTime()
            if (self._data[0]) {
                firstTime = self._data[0].time
            }
            self._data.forEach(function (item) {
                var arg = item.arguments
                if (!/group/.test(item.key)) {
                    arg = [`%c${item.time - firstTime}ms`, 'color:gray;'].concat(arg)
                }
                console[item.key].apply(undefined, arg)
            })
            self._data = []
        },
        $log: function (key, arg) {
            const self = this
            self._data.push({
                key: key,
                time: new Date().getTime(),
                arguments: arg.map(clone)
            })
        },
        $input: function (...arg) {
            const self = this
            const functionName = arg.shift()
            function stringFormat (item) {
                if (typeof item === 'string') {
                    item = `"${item}"`
                }
                return item
            }
            self._data.push({
                key: 'log',
                time: new Date().getTime(),
                arguments: [`${functionName}(`].concat(arg.map(clone).map(stringFormat)).concat(`)`)
            })
        },
        $output: function (functionName, data) {
            const self = this
            if (typeof data === 'string') {
                data = `"${data}"`
            }
            if (typeof data === 'object') {
                data = extend.clone(data)
            }
            self._data.push({
                key: 'log',
                time: new Date().getTime(),
                arguments: [`${functionName}(...) // return `].concat([data])
            })
        }
    }
    ,
    {
    get: function (target, key, receiver) {
        global = typeof global === 'undefined'?window:global
        if (!global.dcDebug) {
            return function empty() {}
        }
        const self = receiver
        if (proxyKeys.includes(key)) {
            // console.log(self._data)
            return function (...arg) {
                Reflect.get(target, '$log', receiver).apply(self, [key, arg])
            }
        }
        return Reflect.get(target, key, receiver)
    }
})
module.exports = aconsole
