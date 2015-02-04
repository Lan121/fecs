/**
 * @file Rule to validate object properties
 * @author chris<wfsr@foxmail.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

    'use strict';
    var NO_QUOTES = 'Expected key `{{name}}` but `\'{{name}}\'` found.baidu093';
    var NEED_QUOTES = 'Expected key `\'{{name}}\'` but `{{name}}` found.baidu094';

    var reservedWords = (function () {
        var map = {};
        [
            'abstract',
            'boolean', 'break', 'byte',
            'case', 'catch', 'char', 'class', 'const', 'continue',
            'debugger', 'default', 'delete', 'do', 'double',
            'else', 'enum', 'export', 'extends',
            'final', 'finally', 'float', 'for', 'function',
            'goto',
            'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface',
            'long',
            'native', 'new',
            'package', 'private', 'protected', 'public',
            'return',
            'short', 'static', 'super', 'switch', 'synchronized',
            'this', 'throw', 'throws', 'transient', 'try', 'typeof',
            'var', 'void', 'volatile',
            'while', 'with'
        ].map(function (key) {
            map[key] = true;
        });

        return map;
    })();


    function getKey(property) {
        return  String(property.key.value || property.key.name);
    }

    function requireQuotes(needs, property) {
        var key = getKey(property);
        var reg = /(^\d|\W)/;

        if (reg.test(key) || key in reservedWords) {
            needs[key] = true;
        }
    }

    return {

        ObjectExpression: function (node) {

            var needs = {};
            var type = {literal: [], identifier: []};

            node.properties.map(function (property) {
                type[property.key.type.toLowerCase()].push(property);
                requireQuotes(needs, property);
            });

            var hadToQuote = !!Object.keys(needs).length;
            var message = hadToQuote ? NEED_QUOTES : NO_QUOTES;

            type[hadToQuote ? 'identifier' : 'literal'].map(function (property) {
                context.report(
                    property,
                    message,
                    {name: getKey(property)}
                );
            });
        }
    };

};