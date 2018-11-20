import { Config } from '@stencil/core';

export const config: Config = {
	namespace: 'fhkuf',
	srcDir: 'backend/stencil_components',
  outputTargets:[
    {
      type: 'www',
	  buildDir: '../frontend/js/stencil_components'
    }
  ]
};

