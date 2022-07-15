import { defineStore } from 'pinia';
import availableComponents, { ComponentDefinition } from './available-components';

export interface VariableBinding {
	type: 'binding',
	variableName: string
}

export interface BooleanProp {
	type: 'boolean',
	default?: boolean
}

export interface TextProp {
	type: 'text',
	default?: string
}

export interface StringValueProp {
	type: string[],
	default?: string
}

export interface ModelBindingProp {
	type: 'modelBinding'
}

export interface ModelBindingPropWithVariable extends ModelBindingProp {
	value: VariableBinding
}

export type ComponentProp = BooleanProp | TextProp | StringValueProp | ModelBindingProp;

type DefaultToValue<T extends { default?: string|boolean }> = Omit<T, 'default'> & {
	value: NonNullable<T['default']> | VariableBinding
}

export type ComponentPropWithValue =
	DefaultToValue<BooleanProp> |
	DefaultToValue<TextProp> |
	DefaultToValue<StringValueProp> |
	ModelBindingPropWithVariable;

export interface RootTemplateNode {
	type: 'root',
	// eslint-disable-next-line no-use-before-define
	children: NonRootTemplateNode[]
}

export interface ComponentTemplateNode {
	type: 'component',
	component: string,
	props: Record<string, ComponentPropWithValue>,
	text: string
}

export interface HtmlTemplateNode {
	type: 'html',
	tag: string,
	attrs: Record<string, DefaultToValue<TextProp>>,
	text: string
}

export type NonRootTemplateNode =
	ComponentTemplateNode |
	HtmlTemplateNode;

export type TemplateNode = RootTemplateNode | NonRootTemplateNode;

export type TemplateNodeWithChildren = RootTemplateNode;

export interface Variable {
	name: string,
	value: string
}

export interface DynamicApp {
	template: RootTemplateNode,
	variables: Variable[]
	// TODO variables, data, computed, etc
}

export function getComponentDefinition( componentName: string ): ComponentDefinition|undefined {
	return availableComponents.find( ( component ) => component.componentName === componentName );
}

export function makeComponentNode( componentName: string, variables: Variable[] ): ComponentTemplateNode {
	const componentDefinition = getComponentDefinition( componentName );
	const props: Record<string, ComponentPropWithValue> = {};
	for ( const [ propName, prop ] of Object.entries( componentDefinition.props ) ) {
		if ( prop.type === 'boolean' ) {
			props[ propName ] = {
				type: 'boolean',
				value: prop.default || false
			};
		} else if ( prop.type === 'text' ) {
			props[ propName ] = {
				type: 'text',
				value: prop.default || ''
			};
		} else if ( prop.type === 'modelBinding' ) {
			if ( variables.length === 0 ) {
				variables.push( { name: 'var1', value: '' } );
			}
			props[ propName ] = {
				type: 'modelBinding',
				value: { type: 'binding', variableName: variables[ 0 ].name }
			};
		} else if ( Array.isArray( prop.type ) ) {
			props[ propName ] = {
				type: prop.type,
				value: prop.default
			};
		}
	}
	return {
		type: 'component',
		component: componentName,
		props,
		text: componentDefinition.defaultText || ''
	};
}

export function makeHtmlNode( tag: string ): HtmlTemplateNode {
	return {
		type: 'html',
		tag,
		attrs: {},
		text: 'Hello'
	};
}

function resolveIndexes( parent: TemplateNodeWithChildren, indexes: number[] ): TemplateNode|null {
	if ( indexes.length === 0 ) {
		return parent;
	}
	let i: number;
	while ( indexes.length > 1 ) {
		[ i, ...indexes ] = indexes;
		const child = parent.children[ i ];
		if ( !child || !( 'children' in child ) ) {
			return null;
		}
		parent = child;
	}
	return parent.children[ indexes[ 0 ] ];
}

/*
function resolveSpliceIndexes( parent: TemplateNodeWithChildren, indexes: number[] ):
[ TemplateNodeWithChildren, number ] {
	const pathToParentNode = [ ...indexes ];
	const indexInParentNode = pathToParentNode.pop();
	const parentNode = resolveIndexes( parent, pathToParentNode ) as
		TemplateNodeWithChildren|null;
	return [ parentNode, indexInParentNode ];
}
*/

export const useStore = defineStore( {
	id: 'app',
	state: (): DynamicApp => {
		return {
			template: { type: 'root', children: [
				makeHtmlNode( 'p' ),
				makeComponentNode( 'CdxButton', [] )
			] },
			variables: [
				{ name: 'foo', value: 'bar' }
			]
		};
	},
	getters: {
		nodeAtIndexes: ( state ) => {
			return ( indexes: number[] ): TemplateNode => {
				return resolveIndexes( state.template, indexes );
			};
		},
		variableValues: ( state ) => {
			const result: Record<string, string> = {};
			for ( const variable of state.variables ) {
				result[ variable.name ] = variable.value;
			}
			return result;
		}
	},
	actions: {
		removeNode( index: number ) {
			this.template.children.splice( index, 1 );
		},
		replaceNode( index: number, newNode: NonRootTemplateNode ) {
			this.template.children.splice( index, 1, newNode );
		},
		moveNode( index: number, direction: 'up' | 'down' ) {
			const [ node ] = this.template.children.splice( index, 1 );
			this.template.children.splice( direction === 'up' ? index - 1 : index + 1, 0, node );
		},
		updateHashFromStore() {
			location.hash = btoa( encodeURIComponent( JSON.stringify( this.$state ) ) );
		},
		updateStoreFromHash() {
			try {
				const data = JSON.parse( decodeURIComponent( atob( location.hash.slice( 1 ) ) ) ) as DynamicApp;
				this.$state = data;
			} catch ( _ignored ) {
			}
		}
	}
} );
