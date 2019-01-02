import { Component, Prop } from "@stencil/core";

@Component({
  tag: "profile-pic",
  styleUrl: "profile-pic.css",
  shadow: true
})
export class ProfilePic {
  @Prop() alt_msg: string;
  @Prop() user_name: string;
  @Prop() class_name: string;

  get_profile_pic_uri(): string {
    return "../images/users/" + this.user_name + ".jpg";
  }

  render() {
    // Image path will be correct if tag is used from /frontend/html/*.html
    return (
      <img
        src={this.get_profile_pic_uri()}
        alt={this.alt_msg}
        class={this.class_name}
      />
    );
  }
}
