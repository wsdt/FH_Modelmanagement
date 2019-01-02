"use strict";
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@stencil/core");
var ProfilePic = /** @class */ (function() {
  function ProfilePic() {}
  ProfilePic.prototype.get_profile_pic_uri = function() {
    return "../images/users/" + this.user_name + ".jpg";
  };
  ProfilePic.prototype.render = function() {
    // Image path will be correct if tag is used from /frontend/html/*.html
    return (
      <img
        src={this.get_profile_pic_uri()}
        alt={this.alt_msg}
        class={this.class_name}
      />
    );
  };
  __decorate([core_1.Prop()], ProfilePic.prototype, "alt_msg", void 0);
  __decorate([core_1.Prop()], ProfilePic.prototype, "user_name", void 0);
  __decorate([core_1.Prop()], ProfilePic.prototype, "class_name", void 0);
  ProfilePic = __decorate(
    [
      core_1.Component({
        tag: "profile-pic",
        styleUrl: "profile-pic.css",
        shadow: true
      })
    ],
    ProfilePic
  );
  return ProfilePic;
})();
exports.ProfilePic = ProfilePic;
