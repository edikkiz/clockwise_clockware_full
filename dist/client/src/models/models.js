"use strict";
exports.__esModule = true;
exports.Status = exports.FormError = exports.Role = void 0;
var Role;
(function (Role) {
    Role["admin"] = "ADMIN";
    Role["master"] = "MASTER";
    Role["user"] = "USER";
})(Role = exports.Role || (exports.Role = {}));
var FormError;
(function (FormError) {
    FormError["TYPE"] = "type";
    FormError["REQUIRED"] = "required";
    FormError["MAXLENGTH"] = "maxLength";
    FormError["MINLENGTH"] = "minLength";
    FormError["PATTERN"] = "pattern";
    FormError["TESTONENUMB"] = "testOneNumb";
    FormError["TESTONESYMBOLLOWERCASE"] = "testOneSymbolLowerCase";
    FormError["TESTONESYMBOLUPPERCASE"] = "testOneSymbolUpperCase";
    FormError["TESTONESYMBOL"] = "testOneSymbol";
    FormError["VALIDATE"] = "validate";
})(FormError = exports.FormError || (exports.FormError = {}));
var Status;
(function (Status) {
    Status["Completed"] = "COMPLETED";
    Status["INPROGRESS"] = "INPROGRESS";
    Status["CREATED"] = "CREATED";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=models.js.map