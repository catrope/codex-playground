<template>
	<div class="cdx-playground-template-nodes-editor">
		<template v-for="( node, index ) in templateNodes" :key="index">
			<div
				v-if="node.type === 'html'"
				class="cdx-playground-template-nodes-editor-html"
			>
				<div>
					HTML tag:
					<CdxTextInput
						v-model="node.tag"
						class="cdx-playground-template-nodes-editor-input"
					/>
					<CdxButton action="destructive" @click="removeNode( index )">
						<CdxIcon :icon="cdxIconTrash" />
					</CdxButton>
				</div>
				<div class="cdx-playground-template-nodes-editor-children">
					<TemplateNodesEditor :template-nodes="node.children" />
				</div>
			</div>
			<div
				v-else-if="node.type === 'component'"
				class="cdx-playground-template-nodes-editor-component"
			>
				<div>
					Component:
					<CdxSelect
						:selected="node.componentName"
						:menu-items="componentMenuItems"
						@update:selected="setComponent( node, $event )"
					/>
					<CdxButton action="destructive" @click="removeNode( index )">
						<CdxIcon :icon="cdxIconTrash" />
					</CdxButton>
				</div>
				<div class="cdx-playground-template-nodes-editor-props">
					<div
						v-for="( prop, propName ) in node.props"
						:key="propName"
					>
						{{ propName }}:
						<template v-if="prop.type === 'literal'">
							<CdxTextInput
								v-if="getPropInfo( node.componentName, propName ).type === 'text'"
								v-model="prop.value"
								class="cdx-playground-template-nodes-editor-input"
							/>
							<CdxToggleSwitch
								v-else-if="getPropInfo( node.componentName, propName ).type === 'boolean'"
								v-model="prop.value"
								class="cdx-playground-template-nodes-editor-toggle"
							/>
							<CdxSelect
								v-else-if="Array.isArray( getPropInfo( node.componentName, propName ).type )"
								v-model:selected="prop.value"
								:menu-items="getPropInfo( node.componentName, propName ).type.map( ( x ) => ( { value: x } ) )"
							/>
						</template>
					</div>
				</div>
				<div class="cdx-playground-template-nodes-editor-children">
					<TemplateNodesEditor :template-nodes="node.defaultSlot" />
				</div>
			</div>
			<div
				v-else-if="node.type === 'text'"
				class="cdx-playground-template-nodes-editor-text"
			>
				Text:
				<CdxTextInput
					v-model="node.text"
					class="cdx-playground-template-nodes-editor-input"
				/>
				<CdxButton action="destructive" @click="removeNode( index )">
					<CdxIcon :icon="cdxIconTrash" />
				</CdxButton>
			</div>
		</template>
		<div>
			<CdxButton @click="addComponent">
				<CdxIcon :icon="cdxIconAdd" />
				Add component
			</CdxButton>
			<CdxButton @click="addText">
				<CdxIcon :icon="cdxIconAdd" />
				Add text
			</CdxButton>
			<CdxButton @click="addHtml">
				<CdxIcon :icon="cdxIconAdd" />
				Add HTML tag
			</CdxButton>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CdxTextInput, CdxSelect, CdxToggleSwitch, CdxIcon, CdxButton } from '@wikimedia/codex';
import { cdxIconAdd, cdxIconTrash } from '@wikimedia/codex-icons';
import { TemplateNode, ComponentTemplateNode } from './dynamic-app';
import availableComponents from './available-components';

export default defineComponent( {
	name: 'TemplateNodesEditor',
	components: {
		CdxTextInput,
		CdxSelect,
		CdxToggleSwitch,
		CdxIcon,
		CdxButton
	},
	props: {
		templateNodes: {
			type: Array as PropType<TemplateNode[]>,
			required: true
		}
	},
	setup( props ) {
		const componentMenuItems = availableComponents.map( ( component ) => ( {
			value: component.componentName
		} ) );

		function getComponentInfo( componentName: string ) {
			return availableComponents
				.find( ( component ) => component.componentName === componentName );
		}

		function getPropInfo( componentName: string, propName: string ) {
			return getComponentInfo( componentName ).props[ propName ];
		}

		function setComponent( node: ComponentTemplateNode, componentName: string ) {
			const componentData = getComponentInfo( componentName );
			node.component = componentData?.component;
			node.importFrom = componentData?.importFrom;
			node.props = {};
			for ( const [ propName, prop ] of Object.entries( componentData.props ) ) {
				node.props[ propName ] = {
					type: 'literal',
					value: prop.default
				};
			}
			if ( componentData.hasDefaultSlot ) {
				if ( node.defaultSlot.length === 0 ) {
					node.defaultSlot = componentData.defaultDefaultSlotContent;
				}
			} else {
				node.defaultSlot = [];
			}
			node.componentName = componentName;
		}

		function addComponent() {
			const newNode: TemplateNode = {
				type: 'component',
				component: CdxButton,
				componentName: 'CdxButton',
				importFrom: '',
				props: {},
				events: {},
				defaultSlot: []
			};
			// TODO maybe allow empty components as a placeholder when first creating?
			setComponent( newNode, 'CdxButton' );
			props.templateNodes.push( newNode );
		}

		function addText() {
			props.templateNodes.push( {
				type: 'text',
				text: ''
			} );
		}

		function addHtml() {
			props.templateNodes.push( {
				type: 'html',
				tag: 'div',
				attrs: {},
				children: []
			} );
		}

		function removeNode( index: number ) {
			props.templateNodes.splice( index, 1 );
		}

		return {
			componentMenuItems,
			getPropInfo,
			setComponent,
			addComponent,
			addText,
			addHtml,
			removeNode,
			cdxIconAdd,
			cdxIconTrash
		};
	}
} );
</script>

<style lang="less">
.cdx-playground-template-nodes-editor {
	&-html,
	&-component,
	&-text {
		margin-top: 0.5em;
	}

	&-input {
		display: inline-block;
		width: 200px;
	}

	&-children,
	&-props {
		margin-left: 1em;
	}
}
</style>
