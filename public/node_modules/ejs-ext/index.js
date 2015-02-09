var fs = require('fs');

// monkey patch ejs
try {
    var ejs = require('ejs'), old_parse = ejs.parse;
    ejs.parse = function () {
        var str = old_parse.apply(this, Array.prototype.slice.call(arguments));
        return str.replace('var buf = [];', 'var buf = []; arguments.callee.buf = buf;');
    };
} catch (e) {
    // disregard if ejs is not installed yet
}

/**
 * This extension will be used by default for all template files
 */
exports.extension = '.ejs';

/**
 * Original templating engine
 */
exports.module = 'ejs';

/**
 * Get source template filename
 */
exports.template = function (name) {
    return __dirname + '/templates/' + name + '.ejs';
};

exports.templateText = function (name, data) {
    switch (name) {

        case 'default_action_view':
        return '<div class="page-header"><h1>' + data.join('#') + '</h1></div>\n';

        case 'scaffold_show':
        var fields = [];
        data.forEach(function (property) {
            switch (property.type) {
                default:
                fields.push('<tr><th>' + property.name + '</th><td><%= {{ model }}.' + property.name + ' %></td></tr>');
                break;
            }
        });
        return fs.readFileSync(exports.template('scaffold_show')).toString().replace('FIELDS', fields.join('\n\n        '));

        case 'scaffold_form':
        var form = '<%- errorMessagesFor({{ model }}) %>\n';
        data.forEach(function (property) {
            switch (property.type) {
                case 'Boolean':
                form += [
                    '<div class="control-group">',
                    '   <%- form.label("' + property.name + '", false, {class: "control-label"}) %>',
                    '   <div class="controls">',
                    '       <%- form.checkbox("' + property.name + '") %>',
                    '   </div>',
                    '</div>'
                ].join('\n\n') + '\n';
                break;
                default:
                form += [
                    '<div class="control-group">',
                    '   <%- form.label("' + property.name + '", false, {class: "control-label"}) %>',
                    '   <div class="controls">',
                    '       <%- form.input("' + property.name + '") %>',
                    '   </div>',
                    '</div>'
                ].join('\n') + '\n';
            }
        });
        return form;
    }
};

