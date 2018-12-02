/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface KevKevin {
    'first': string;
    'last': string;
    'middle': string;
  }
  interface KevKevinAttributes extends StencilHTMLAttributes {
    'first'?: string;
    'last'?: string;
    'middle'?: string;
  }

  interface ProfilePic {
    'alt_msg': string;
    'class_name': string;
    'user_name': string;
  }
  interface ProfilePicAttributes extends StencilHTMLAttributes {
    'alt_msg'?: string;
    'class_name'?: string;
    'user_name'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'KevKevin': Components.KevKevin;
    'ProfilePic': Components.ProfilePic;
  }

  interface StencilIntrinsicElements {
    'kev-kevin': Components.KevKevinAttributes;
    'profile-pic': Components.ProfilePicAttributes;
  }


  interface HTMLKevKevinElement extends Components.KevKevin, HTMLStencilElement {}
  var HTMLKevKevinElement: {
    prototype: HTMLKevKevinElement;
    new (): HTMLKevKevinElement;
  };

  interface HTMLProfilePicElement extends Components.ProfilePic, HTMLStencilElement {}
  var HTMLProfilePicElement: {
    prototype: HTMLProfilePicElement;
    new (): HTMLProfilePicElement;
  };

  interface HTMLElementTagNameMap {
    'kev-kevin': HTMLKevKevinElement
    'profile-pic': HTMLProfilePicElement
  }

  interface ElementTagNameMap {
    'kev-kevin': HTMLKevKevinElement;
    'profile-pic': HTMLProfilePicElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
