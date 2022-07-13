import { defineStore } from 'pinia';
import availableComponents, { ComponentDefinition } from './available-components';

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

export type ComponentProp = BooleanProp | TextProp | StringValueProp;

type DefaultToValue<T extends { default?: string|boolean }> = Omit<T, 'default'> & {
	value: NonNullable<T['default']>
}

export type ComponentPropWithValue =
	DefaultToValue<BooleanProp> |
	DefaultToValue<TextProp> |
	DefaultToValue<StringValueProp>;

export interface RootTemplateNode {
	type: 'root',
	// eslint-disable-next-line no-use-before-define
	children: NonRootTemplateNode[]
}

export interface ComponentTemplateNode {
	type: 'component',
	component: string,
	props: Record<string, ComponentPropWithValue>,
	// eslint-disable-next-line no-use-before-define
	children: NonRootTemplateNode[]
}

export interface HtmlTemplateNode {
	type: 'html',
	tag: string,
	attrs: Record<string, string>,
	// eslint-disable-next-line no-use-before-define
	children: NonRootTemplateNode[]
}

export interface TextTemplateNode {
	type: 'text',
	text: string
}

export type NonRootTemplateNode =
	ComponentTemplateNode |
	HtmlTemplateNode |
	TextTemplateNode;

export type TemplateNode = RootTemplateNode | NonRootTemplateNode;

export type TemplateNodeWithChildren = RootTemplateNode | ComponentTemplateNode | HtmlTemplateNode;

export interface DynamicApp {
	template: RootTemplateNode
	// TODO variables, data, computed, etc
}

export function getComponentDefinition( componentName: string ): ComponentDefinition|undefined {
	return availableComponents.find( ( component ) => component.componentName === componentName );
}

export function makeComponentNode( componentName: string ): ComponentTemplateNode {
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
		children: componentDefinition.defaultContent || []
	};
}

export function makeHtmlNode( tag: string ): HtmlTemplateNode {
	return {
		type: 'html',
		tag,
		attrs: {},
		children: []
	};
}

export function makeTextNode( text: string ): TextTemplateNode {
	return {
		type: 'text',
		text
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
				{ type: 'html', tag: 'p', attrs: {}, children: [
					{ type: 'text', text: 'Hello world!' }
				] }
			] }
		};
	},
	getters: {
		nodeAtIndexes: ( state ) => {
			return ( indexes: number[] ): TemplateNode => {
				return resolveIndexes( state.template, indexes );
			};
		}
	}
} );
