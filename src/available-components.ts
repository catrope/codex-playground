import { DefineComponent } from 'vue';
import { TemplateNode } from './dynamic-app';

export interface ComponentProp {
	// TODO more types, make default match type. Look at codex-docs structure for this
	type: 'text' | 'boolean' | string[],
	default: string|number|boolean,
	description?: string
}

export interface Component {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: DefineComponent<any, any, any, any, any, any, any, any>,
	componentName: string,
	importFrom: string,
	props: Record<string, ComponentProp>,
	hasDefaultSlot?: boolean,
	defaultDefaultSlotContent?: TemplateNode[],
	description?: string
}

import { CdxButton, CdxProgressBar } from '@wikimedia/codex';

const availableComponents: Component[] = [
	{
		component: CdxButton,
		componentName: 'CdxButton',
		importFrom: '@wikimedia/codex',
		props: {
			action: {
				type: [ 'default', 'progressive', 'destructive' ],
				default: 'default'
			},
			type: {
				type: [ 'normal', 'primary', 'quiet' ],
				default: 'normal'
			},
			disabled: {
				type: 'boolean',
				default: false
			}
		},
		hasDefaultSlot: true,
		defaultDefaultSlotContent: [
			{ type: 'text', text: 'Click me' }
		]
	},
	{
		component: CdxProgressBar,
		componentName: 'CdxProgressBar',
		importFrom: '@wikimedia/codex',
		props: {
			inline: {
				type: 'boolean',
				default: false
			}
		}
	}
];

export default availableComponents;
