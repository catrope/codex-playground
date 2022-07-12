import { DefineComponent } from 'vue';
import { TemplateNode } from './dynamic-app';

// TODO for icons we'll need something more advanced
// TODO menus with items
// TODO form elements that require v-model bindings
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

import { CdxButton, CdxCheckbox, CdxMessage, CdxProgressBar, CdxRadio, CdxTab, CdxTabs, CdxTextInput } from '@wikimedia/codex';

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
		}
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
		hasDefaultSlot: true,
		defaultDefaultSlotContent: [
			{ type: 'text', text: 'Message text' }
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
		}
	},
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
		hasDefaultSlot: true,
		defaultDefaultSlotContent: [
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
		hasDefaultSlot: true,
		defaultDefaultSlotContent: [
			{ type: 'component', component: CdxTab, componentName: 'CdxTab', importFrom: '@wikimedia/codex', props: { name: { type: 'literal', value: 'tab1' }, label: { type: 'literal', value: 'First tab' } }, events: {}, defaultSlot: [
				{ type: 'text', text: 'Content of first tab' }
			] },
			{ type: 'component', component: CdxTab, componentName: 'CdxTab', importFrom: '@wikimedia/codex', props: { name: { type: 'literal', value: 'tab2' }, label: { type: 'literal', value: 'Second tab' } }, events: {}, defaultSlot: [
				{ type: 'text', text: 'Content of second tab' }
			] },
			{ type: 'component', component: CdxTab, componentName: 'CdxTab', importFrom: '@wikimedia/codex', props: { name: { type: 'literal', value: 'tab3' }, label: { type: 'literal', value: 'Third tab' } }, events: {}, defaultSlot: [
				{ type: 'text', text: 'Content of third tab' }
			] }
		]
	},
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
