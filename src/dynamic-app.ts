import { DefineComponent, h, VNodeArrayChildren, VNodeChild } from 'vue';
import escapeHtml from 'escape-html';

export interface LiteralProp {
	type: 'literal',
	value: string|number|boolean
}

export interface VariableProp {
	type: 'variable',
	variable: string
}

export type Prop = LiteralProp | VariableProp;

/* eslint-disable no-use-before-define */
export type TemplateNode =
	ComponentTemplateNode |
	HtmlTemplateNode |
	TextTemplateNode |
	InterpolationTemplateNode;
/* eslint-enable no-use-before-define */

export interface ComponentTemplateNode {
	type: 'component',
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: DefineComponent<any, any, any, any, any, any, any, any>,
	componentName: string,
	importFrom: string,
	props: Record<string, Prop>,
	events: Record<string, string>,
	defaultSlot: TemplateNode[] // TODO other slots?
}

export interface HtmlTemplateNode {
	type: 'html',
	tag: string,
	attrs: Record<string, Prop>,
	children: TemplateNode[]
}

export interface TextTemplateNode {
	type: 'text',
	text: string
}

export interface InterpolationTemplateNode {
	type: 'interpolation',
	variable: string
}

export interface DynamicApp {
	template: TemplateNode[],
	// TODO variables, data, computed, etc
}

export function renderTemplate( template: TemplateNode[] ): VNodeArrayChildren {
	function renderProps( props: Record<string, Prop> ): Record<string, unknown> {
		const rendered: Record<string, unknown> = {};
		for ( const [ propName, prop ] of Object.entries( props ) ) {
			if ( prop.type === 'literal' ) {
				rendered[ propName ] = prop.value;
			} else if ( prop.type === 'variable' ) {
				rendered[ propName ] = `TODO implement variable ${prop.variable}`;
			}
		}
		return rendered;
	}

	function renderEvents( events: Record<string, string> ) {
		// TODO implement
		return events;
	}

	return template.map( ( node ): VNodeChild => {
		if ( node.type === 'component' ) {
			return h(
				node.component,
				{
					...renderProps( node.props ),
					...renderEvents( node.events )
				},
				() => renderTemplate( node.defaultSlot )
			);
		} else if ( node.type === 'html' ) {
			return h(
				node.tag,
				renderProps( node.attrs ),
				renderTemplate( node.children )
			);
		} else if ( node.type === 'text' ) {
			return node.text;
		} else if ( node.type === 'interpolation' ) {
			return `TODO implement interpolation ${node.variable}`;
		}
		return '';
	} );
}

export function makeTemplateSource( template: TemplateNode[], indent = 1 ): string {
	function stringifyProps( props: Record<string, Prop> ): string {
		return Object.entries( props ).map( ( [ propName, prop ] ) => {
			if ( prop.type === 'variable' ) {
				return `:${propName}="${escapeHtml( prop.variable )}"`;
			}
			if ( typeof prop.value === 'boolean' ) {
				return prop.value ? propName : '';
			}
			if ( typeof prop.value === 'string' ) {
				return `${propName}="${escapeHtml( prop.value )}"`;
			}
			return `:${propName}="${escapeHtml( JSON.stringify( prop.value ) )}"`;
		} ).filter( Boolean ).join( ' ' );
	}

	return template.map( ( node ) => {
		const tabs = Array( indent + 1 ).join( '\t' );
		if ( node.type === 'component' || node.type === 'html' ) {
			const tagName = node.type === 'component' ? node.componentName : node.tag;
			const attrs = stringifyProps( node.type === 'component' ? node.props : node.attrs );
			const content = makeTemplateSource( node.type === 'component' ? node.defaultSlot : node.children, indent + 1 );
			return `${tabs}<${tagName}${attrs ? ' ' + attrs : ''}` + (
				content ?
					`>\n${content}\n${tabs}</${tagName}>` :
					' />'
			);
		} else if ( node.type === 'text' ) {
			return `${tabs}${node.text}`;
		} else if ( node.type === 'interpolation' ) {
			return `${tabs}{{ ${node.variable} }}`;
		}
		return '';
	} ).join( '\n' );
}

export function makeScriptSource( app: DynamicApp, indent = 1 ): string {
	const tabs = Array( indent + 1 ).join( '\t' );

	// Gather all components used and group them by import source
	const foundComponents = new Set<string>();
	const imports = new Map<string, Set<string>>();
	function gatherComponents( template: TemplateNode[] ) {
		for ( const node of template ) {
			if ( node.type === 'component' ) {
				if ( !foundComponents.has( node.componentName ) ) {
					foundComponents.add( node.componentName );
					if ( !imports.has( node.importFrom ) ) {
						imports.set( node.importFrom, new Set<string>() );
					}
					imports.get( node.importFrom ).add( node.componentName );
				}
				gatherComponents( node.defaultSlot );
			} else if ( node.type === 'html' ) {
				gatherComponents( node.children );
			}
		}
	}
	gatherComponents( app.template );

	const importStatements =
		Array.from( imports.entries() ).map( ( [ importSource, components ] ) =>
			`${tabs}import { ${Array.from( components.values() ).join( ', ' )} } from '${importSource}';`
		).join( '\n' );

	return `${tabs}import { defineComponent } from 'vue';\n${importStatements}\n\n` +
		`${tabs}export default defineComponent( {\n` +
		`${tabs}\tcomponents: {\n${Array.from( foundComponents ).map( ( c ) => `${tabs}\t\t${c}` ).join( '\n' )}\n` +
		`${tabs}\t}\n` +
		`${tabs}} );`;
}
