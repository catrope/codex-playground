import { DefineComponent } from 'vue';
import type { ComponentProp } from './store';

export interface ComponentDefinition {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: DefineComponent<any, any, any, any, any, any, any, any>,
	componentName: string,
	importFrom: string,
	props: Record<string, ComponentProp>,
	defaultText?: string
}

import { CdxButton, CdxCheckbox, CdxMessage, CdxProgressBar, CdxRadio, CdxTextInput } from '@wikimedia/codex';

const availableComponents: ComponentDefinition[] = [
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
		defaultText: 'Click me'
	},
	{
		component: CdxCheckbox,
		componentName: 'CdxCheckbox',
		importFrom: '@wikimedia/codex',
		props: {
			inputValue: {
				type: 'text', // FIXME allows numbers too
				default: ''
			},
			disabled: {
				type: 'boolean',
				default: false
			},
			indeterminate: {
				type: 'boolean',
				default: false
			},
			inline: {
				type: 'boolean',
				default: false
			}
		},
		defaultText: 'Label'
	},
	{
		component: CdxMessage,
		componentName: 'CdxMessage',
		importFrom: '@wikimedia/codex',
		props: {
			type: {
				type: [ 'notice', 'warning', 'error', 'success' ],
				default: 'notice'
			},
			inline: {
				type: 'boolean',
				default: false
			},
			dismissButtonLabel: {
				type: 'text',
				default: 'Close'
			}
		},
		defaultText: 'Message text'
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
	},
	{
		component: CdxRadio,
		componentName: 'CdxRadio',
		importFrom: '@wikimedia/codex',
		props: {
			inputValue: {
				type: 'text', // FIXME allows numbers too
				default: ''
			},
			name: {
				type: 'text',
				default: ''
			},
			disabled: {
				type: 'boolean',
				default: false
			},
			indeterminate: {
				type: 'boolean',
				default: false
			},
			inline: {
				type: 'boolean',
				default: false
			}
		},
		defaultText: 'Label'
	},
	/*
	// TODO Tab shouldn't be allowed outside of Tabs
	{
		component: CdxTab,
		componentName: 'CdxTab',
		importFrom: '@wikimedia/codex',
		props: {
			disabled: {
				type: 'boolean',
				default: false
			},
			name: {
				type: 'text',
				default: 'tabname' // TODO default to a new unique string (similar with radios/checkboxes)
			},
			label: {
				type: 'text',
				default: 'Tab label'
			}
		},
		defaultContent: [
			{ type: 'text', text: 'Tab content' }
		]
	},
	// TODO Tabs requires a v-model binding
	{
		component: CdxTabs,
		componentName: 'CdxTabs',
		importFrom: '@wikimedia/codex',
		props: {
			framed: {
				type: 'boolean',
				default: false
			}
		},
		defaultContent: [
			{ type: 'component', component: 'CdxTab', props: { name: { type: 'text', value: 'tab1' }, label: { type: 'text', value: 'First tab' } }, children: [
				{ type: 'text', text: 'Content of first tab' }
			] },
			{ type: 'component', component: 'CdxTab', props: { name: { type: 'text', value: 'tab2' }, label: { type: 'text', value: 'Second tab' } }, children: [
				{ type: 'text', text: 'Content of second tab' }
			] },
			{ type: 'component', component: 'CdxTab', props: { name: { type: 'text', value: 'tab3' }, label: { type: 'text', value: 'Third tab' } }, children: [
				{ type: 'text', text: 'Content of third tab' }
			] }
		]
	},
	*/
	{
		component: CdxTextInput,
		componentName: 'CdxTextInput',
		importFrom: '@wikimedia/codex',
		props: {
			// TODO startIcon and endIcon require icon props
			clearable: {
				type: 'boolean',
				default: false
			},
			disabled: {
				type: 'boolean',
				default: false
			},
			placeholder: {
				type: 'text',
				default: ''
			}
		}
	}
];

export default availableComponents;
