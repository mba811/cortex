'use strict';

var express = require('express');
var node_path = require('path');
var fs = require('fs-sync');

var parser = require('argv-parser');

module.exports = {
    route: '/_action/:action',
    callback: function (req, res, next) {
        var action = req.params.action;
        var options = req.query;
        var parsed;

        var option_file = node_path.resolve(__dirname, '..', 'option', action + '.js');
        var command_file = node_path.resolve(__dirname, '..', 'command', action + '.js');

        if(fs.exists(option_file)){
            var option_rules = require(option_file).options;
            parsed = parser.clean(options, {
                rules: option_rules
            });
        }

        if(parsed.err){
            return res.send(500, {
                error: parsed.errors
            });
        
        }else{
            options = parsed.parsed;
        }

        if(!fs.exists(command_file)){
            return res.send(500, {
                error: 'Action "' + action + '" not found.'
            });
        }

        var commander = require(command_file);

        commander(options, function (err, data) {
            if(err){
                res.send(500, {
                    error: err.message || err
                });

            }else{
                res.send(200, {
                    message: data || 'ok'
                });
            }
        });
    },

    method: 'get',

    open: function (root) {
        require('child_process').exec('open ' + root + '/_action/build?cwd=/Users/Kael/Codes/F2EI/neurons/asset');
    }
};