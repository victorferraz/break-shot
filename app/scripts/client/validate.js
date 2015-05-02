'use strict';

var Validate = function (fields) {
    this.fields = fields;
    this.errors = [];
};

Validate.prototype.isNotEmpty = function (field) {
    if (  $(field).val() !== '' )  {
        return true;
    } else {
        return false;
    }
};

Validate.prototype.isCheckedRadio = function(field) {
    if ($(field).data('group-checkbox') === true) {
        if ($(field).find('input:checked').length === 0 ){
            return false;
        } else {
            return true;
        }
    }else{
        return false;
    }
};

Validate.prototype.pushError = function (field) {
    this.errors.push(field);
};

Validate.prototype.hook = function (valid, field) {
    this.setValidClass(valid, field);
    if (!valid) {
        this.pushError(field);
    } else {
        return;
    }
};

Validate.prototype.setValidClass = function (valid, field) {
    if (valid) {
        this.success(field);
    } else {
        this.error(field);
    }
};

Validate.prototype.error = function (field) {
    $(field).removeClass('input-success');
    $(field).addClass('input-error');
};

Validate.prototype.success = function (field) {
    $(field).removeClass('input-error');
    $(field).addClass('input-success');
};

Validate.prototype.isValid = function (fields) {
    this.fields = fields;
    this.errors = [];
    for (var i = 0, l = this.fields.length; i < l; i++) {
        if ( this.isNotEmpty(this.fields[i]) || this.isCheckedRadio(this.fields[i]) ){

            this.hook(true, this.fields[i]);

        } else {
            this.hook(false, this.fields[i]);
        }
    }

    if (this.errors.length <= 0) {
        return true;
    } else {
        return false;
    }
};

module.exports = new Validate();
