var extend = require('safe-extend')
var fecha = require('fecha')
var jsonFormat = require('json-format')
global = typeof global === 'undefined'?window:global
var proxyKeys = ['log', 'group', 'groupEnd', 'error', 'info', 'warn', 'dir', 'dirxml', 'table', 'groupCollapsed', 'count', 'assert']
var clone = function clone(item) {
    if (typeof item === 'object') {
        item = extend.clone(item)
    }
    return item
}
function stringFormat (item) {
    if (typeof item === 'string') {
        let trimItem = item.trim()
        let wrapSymbol = (trimItem[0] + trimItem[trimItem.length-1])
        let isJSON =  wrapSymbol === '{}' || wrapSymbol === '[]'
        if (!isJSON) {
            item = `"${item}"`
        }
    }
    return item
}
function toJsonFormat (item) {
    if (typeof item === 'object') {
        item = `\r\n${jsonFormat(item)}\r\n`
    }
    return item
}
function appendComma(item, index, arr) {
    if (index !== arr.length-1 && typeof item === 'string') {
        item = item + ','
        item = item.replace(/\r\n\,$/, ',')
    }
    return item
}
var consoleMap = {}
var create = function (name) {
    name = name || ''
    if (consoleMap[name]) {
        return consoleMap
    }
    else {
        let newConsole = new Proxy(
            {
                groupCount: 0,
                _data: [],
                $show: function () {
                    const self = this
                    var firstTime = new Date().getTime()
                    if (self._data[0]) {
                        firstTime = self._data[0].time
                    }
                    self._data.forEach(function (item) {
                        var arg = item.arguments
                        if (item.type === 'input') {
                            arg.unshift('📝')
                        }
                        if (item.type === 'output') {
                            arg.unshift('🖨️')
                        }
                        if (!/group/.test(item.key)) {
                            let msMsg = `%c${item.time - firstTime}ms`
                            let style = 'color:gray;'
                            arg = [msMsg, style].concat(arg)
                        }
                        console[item.key].apply(undefined, arg)
                    })
                    self._data = []
                    self.groupCount = 0
                },
                $log: function (key, arg) {
                    const self = this
                    self._data.push({
                        key: key,
                        time: new Date().getTime(),
                        arguments: arg.map(clone)
                    })
                },
                $json: function (...arg) {
                    const self = this
                    arg = arg.map(clone).map(toJsonFormat)
                    self._data.push({
                        key: 'log',
                        type: 'json',
                        time: new Date().getTime(),
                        arguments: arg
                    })
                },
                $inputJson: function (...arg) {
                    this.$input.apply(this, arg.map(toJsonFormat))
                },
                $outputJson: function (...arg) {
                    this.$output.apply(this, arg.map(toJsonFormat))
                },
                $input: function (...arg) {
                    const self = this
                    const functionName = arg.shift()
                    self._data.push({
                        key: 'log',
                        type: 'input',
                        time: new Date().getTime(),
                        arguments: [`${functionName}(`].concat(arg.map(clone).map(stringFormat).map(appendComma)).concat(')')
                    })
                },
                $output: function (functionName, data) {
                    const self = this
                    self._data.push({
                        key: 'log',
                        type: 'output',
                        time: new Date().getTime(),
                        arguments: [`${functionName}(...)`].concat(
                            [data].map(clone).map(stringFormat)
                        )
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
                if (key === 'group' || key === 'groupCollapsed') {
                    Reflect.set(target, 'groupCount', Reflect.get(target, 'groupCount', receiver) + 1 , receiver)
                }
                if (key === 'groupEnd') {
                    let newGroupEndCount = Reflect.get(target, 'groupCount', receiver) - 1
                    // 防止多次 groupEnd
                    if (newGroupEndCount <= 0) {
                        newGroupEndCount = 0
                    }
                    Reflect.set(target, 'groupCount',  newGroupEndCount , receiver)
                    Reflect.get(target, '$show', receiver).apply(target, [])
                }
                const self = receiver
                if (proxyKeys.includes(key)) {
                    // console.log(self._data)
                    return function (...arg) {
                        Reflect.get(target, '$log', receiver).apply(target, [key, arg])
                    }
                }
                return Reflect.get(target, key, receiver)
            }
        })
        consoleMap[name] = newConsole
        return newConsole
    }
}
module.exports = create()
module.exports.create = create
