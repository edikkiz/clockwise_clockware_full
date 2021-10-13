"use strict";
exports.__esModule = true;
require("./Preloader.css");
var TransparentPreloader = function (_a) {
    var isLoading = _a.isLoading;
    return isLoading ? (<div className={"transparent-preloader"}>
      <div className='transparent-preloader__spinner'/>
    </div>) : (<></>);
};
exports["default"] = TransparentPreloader;
//# sourceMappingURL=Preloader.js.map