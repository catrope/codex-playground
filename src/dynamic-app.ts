import { h, VNodeArrayChildren, VNodeChild } from 'vue';
import escapeHtml from 'escape-html';

import { DynamicApp, TemplateNode, ComponentPropWithValue, getComponentDefinition, TemplateNodeWithChildren } from './store';

// TODO convert to non-array style
export function renderTemplate( template: TemplateNode[] ): VNodeArrayChildren {
	function renderProps( props: Record<string, ComponentPropWithValue> ): Record<string, unknown> {
		const rendered: Record<string, unknown> = {};
		for ( const [ propName, prop ] of Object.entries( props ) ) {
			rendered[ propName ] = prop.value;
		}
		return rendered;
	}

	return template.map( ( node ): VNodeChild => {
		if ( node.type === 'component' ) {
			const componentDef = getComponentDefinition( node.component );
			if ( !componentDef ) {
				return '';
			}
			return h(
				componentDef.component,
				{
					...renderProps( node.props )
					// TODO events
				},
				() => node.text
			);
		} else if ( node.type === 'html' ) {
			return h(
				node.tag,
				node.attrs,
				node.text
			);
		}
		return '';
	} );
}

function getDefaultPropValues( componentName: string ): Record<string, string> {
	const def = getComponentDefinition( componentName );
	if ( !def ) {
		return {};
	}
	const defaults = {};
	for ( const propName in def.props ) {
		if ( 'default' in def.props[ propName ] ) {
			defaults[ propName ] = def.props[ propName ].default;
		}
	}
	return defaults;
}

// TODO convert to non-array style
export function makeTemplateSource( template: TemplateNode[], indent = 1 ): string {
	function stringifyPropsOrAttrs(
		props: Record<string, ComponentPropWithValue|string>,
		defaults: Record<string, string> = {}
	): string {
		return Object.entries( props ).map( ( [ propName, prop ] ) => {
			const propValue = typeof prop === 'string' ? prop : prop.value;
			if ( propValue === defaults[ propName ] ) {
				return '';
			}
			if ( typeof propValue === 'boolean' ) {
				return propValue ? propName : '';
			}
			if ( typeof propValue === 'string' ) {
				return `${propName}="${escapeHtml( propValue )}"`;
			}
			return `:${propName}="${escapeHtml( JSON.stringify( propValue ) )}"`;
		} ).filter( Boolean ).join( ' ' );
	}

	return template.map( ( node ) => {
		const tabs = Array( indent + 1 ).join( '\t' );
		if ( node.type === 'component' || node.type === 'html' ) {
			const tagName = node.type === 'component' ? node.component : node.tag;
			const attrs = stringifyPropsOrAttrs(
				node.type === 'component' ? node.props : node.attrs,
				node.type === 'component' ? getDefaultPropValues( node.component ) : {}
			);
			// const content = makeTemplateSource( node.children, indent + 1 );
			return `${tabs}<${tagName}${attrs ? ' ' + attrs : ''}` + (
				node.text ?
					`>\n${tabs}\t${node.text}\n${tabs}</${tagName}>` :
					' />'
			);
		}
		return '';
	} ).join( '\n' );
}

export function makeScriptSource( app: DynamicApp, indent = 1 ): string {
	const tabs = Array( indent + 1 ).join( '\t' );

	// Gather all components used and group them by import source
	const foundComponents = new Set<string>();
	const imports = new Map<string, Set<string>>();
	function gatherComponents( parentNode: TemplateNodeWithChildren ) {
		for ( const node of parentNode.children ) {
			if ( node.type === 'component' ) {
				if ( !foundComponents.has( node.component ) ) {
					foundComponents.add( node.component );
					const componentDef = getComponentDefinition( node.component );
					if ( componentDef ) {
						if ( !imports.has( componentDef.importFrom ) ) {
							imports.set( componentDef.importFrom, new Set<string>() );
						}
						imports.get( componentDef.importFrom ).add( node.component );
					}
				}
			}
			if ( 'children' in node ) {
				gatherComponents( node );
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
