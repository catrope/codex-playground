<template>
	<div class="cdx-playground-editor">
		<div class="cdx-playground-editor-main">
			<template v-if="editMode">
				<div>
					Type:
					<CdxSelect
						v-model:selected="componentOrTag"
						:menu-items="componentAndTagMenuItems"
					/>
				</div>
				<div v-if="shouldHaveText">
					Text:
					<CdxTextInput
						v-model="node.text"
						class="cdx-playground-editor-textinput"
					/>
				</div>
				<div v-if="node.type === 'component'">
					Props:
					<div
						v-for="( propValue, propName ) in node.props"
						:key="propName"
						class="cdx-playground-editor-prop"
					>
						{{ propName }}:
						<template v-if="typeof propValue.value === 'object'">
							<em>Variable:</em>
							<CdxSelect
								v-model:selected="propValue.value.variableName"
								:menu-items="variableMenuItems"
							/>
							<CdxButton
								v-if="propValue.type !== 'modelBinding'"
								@click="unbindVariable( propName )"
							>
								Unbind variable
							</CdxButton>
						</template>
						<template v-else>
							<CdxTextInput
								v-if="propValue.type === 'text'"
								v-model="propValue.value"
								class="cdx-playground-editor-textinput"
							/>
							<CdxToggleSwitch
								v-else-if="propValue.type === 'boolean'"
								v-model="propValue.value"
							/>
							<template
								v-else-if="propValue.type === 'modelBinding'"
							>
								<!-- Not possible, but TypeScript doesn't know that -->
							</template>
							<CdxSelect
								v-else
								v-model:selected="propValue.value"
								:menu-items="propValue.type.map( ( x ) => ( { value: x } ) )"
							/>
							<CdxButton v-if="variablesAvailable" @click="bindVariable( propName )">
								Bind variable
							</CdxButton>
						</template>
					</div>
				</div>
			</template>
			<template v-else>
				<p class="cdx-playground-editor-description">
					{{ description }}
				</p>
				<p class="cdx-playground-editor-text">
					{{ node.text }}
				</p>
			</template>
		</div>
		<div class="cdx-playground-editor-actions">
			<CdxButton
				v-if="!editMode"
				type="quiet"
				:disabled="index === 0"
				@click="moveUp"
			>
				<CdxIcon :icon="cdxIconUpTriangle" />
			</CdxButton>
			<CdxButton
				v-if="!editMode"
				type="quiet"
				:disabled="isLast"
				@click="moveDown"
			>
				<CdxIcon :icon="cdxIconDownTriangle" />
			</CdxButton>
			<CdxButton
				v-if="!editMode"
				type="quiet"
				@click="editMode = true"
			>
				<CdxIcon :icon="cdxIconEdit" />
			</CdxButton>
			<CdxButton
				v-else
				type="quiet"
				@click="editMode = false"
			>
				<CdxIcon :icon="cdxIconCheck" />
			</CdxButton>
			<CdxButton
				v-if="!editMode"
				action="destructive"
				type="quiet"
				@click="remove"
			>
				<CdxIcon :icon="cdxIconTrash" />
			</CdxButton>
		</div>
		<!-- <div v-if="'children' in node">
			<div
				v-for="( child, index ) in node.children"
				:key="index"
				class="cdx-playground-editor-children"
			>
				<TemplateNodeEditor :node="child" />
			</div>
		</div> -->
	</div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue';
import { getComponentDefinition, makeComponentNode, makeHtmlNode, NonRootTemplateNode, useStore } from './store';
import availableComponents from './available-components';
import { CdxButton, CdxIcon, CdxTextInput, CdxToggleSwitch, CdxSelect, MenuItemData } from '@wikimedia/codex';
import { cdxIconUpTriangle, cdxIconDownTriangle, cdxIconEdit, cdxIconCheck, cdxIconTrash } from '@wikimedia/codex-icons';

const tagMenuItems: MenuItemData[] = [
	{ value: 'p', label: 'Paragraph' },
	{ value: 'h1', label: 'Heading 1' },
	{ value: 'h2', label: 'Heading 2' },
	{ value: 'h3', label: 'Heading 3' },
	{ value: 'h4', label: 'Heading 4' },
	{ value: 'h5', label: 'Heading 5' },
	{ value: 'h6', label: 'Heading 6' }
];

const componentMenuItems = availableComponents.map( ( component ) => ( {
	value: component.componentName
} ) );

const componentAndTagMenuItems = [ ...tagMenuItems, ...componentMenuItems ];

export default defineComponent( {
	name: 'TemplateNodeEditor',
	components: {
		CdxButton,
		CdxIcon,
		CdxTextInput,
		CdxToggleSwitch,
		CdxSelect
	},
	props: {
		index: {
			type: Number,
			required: true
		}
	},
	setup( props ) {
		const store = useStore();
		const node = computed( () => store.template.children[ props.index ] );
		const isLast = computed( () => props.index === store.template.children.length - 1 );
		const shouldHaveText = computed( () =>
			node.value.type === 'html' ||
				!!getComponentDefinition( node.value.component )?.defaultText
		);
		const editMode = ref( false );
		const variablesAvailable = computed( () => store.variables.length > 0 );

		const description = computed( () => {
			if ( node.value.type === 'html' ) {
				const tag = node.value.tag;
				return tagMenuItems.find( ( item ) => item.value === tag )?.label || tag;
			} else if ( node.value.type === 'component' ) {
				return node.value.component;
			}
			return '';
		} );

		const componentOrTag = computed( {
			get() {
				return node.value.type === 'html' ? node.value.tag : node.value.component;
			},
			set( newVal: string ) {
				let newNode: NonRootTemplateNode;
				if ( getComponentDefinition( newVal ) ) {
					newNode = makeComponentNode( newVal, store.variables );
				} else {
					newNode = makeHtmlNode( newVal );
				}
				// Keep the old text, but not if the new component doesn't take text
				// TODO we should have an explicit flag for if something takes text, not base it on
				// whether there is default text
				newNode.text = newNode.text ? ( node.value.text || newNode.text ) : '';
				store.replaceNode( props.index, newNode );
			}
		} );

		const variableMenuItems = computed( () => store.variables.map( ( v ) => ( {
			value: v.name,
			label: `${v.name} (${v.value ? `"${v.value}"` : 'empty'})`
		} ) ) );

		function remove() {
			store.removeNode( props.index );
		}

		function moveUp() {
			store.moveNode( props.index, 'up' );
		}

		function moveDown() {
			store.moveNode( props.index, 'down' );
		}

		function bindVariable( propName: string ) {
			if ( node.value.type !== 'component' ) {
				return;
			}
			node.value.props[ propName ].value = {
				type: 'binding',
				variableName: store.variables[ 0 ].name
			};
		}

		function unbindVariable( propName: string ) {
			if ( node.value.type !== 'component' ) {
				return;
			}
			const binding = node.value.props[ propName ].value;
			if ( typeof binding !== 'object' ) {
				return;
			}
			node.value.props[ propName ].value = store.variableValues[ binding.variableName ];
		}

		return {
			node,
			isLast,
			editMode,
			variablesAvailable,
			description,
			shouldHaveText,
			componentOrTag,
			componentAndTagMenuItems,
			variableMenuItems,
			remove,
			moveUp,
			moveDown,
			bindVariable,
			unbindVariable,
			cdxIconTrash,
			cdxIconUpTriangle,
			cdxIconDownTriangle,
			cdxIconEdit,
			cdxIconCheck
		};
	}
} );
</script>

<style lang="less">
.cdx-playground-editor {
	position: relative;
	border: 1px solid black;
	padding: 0.5em;

	&-text {
		margin-left: 1em;
	}

	&-actions {
		position: absolute;
		top: 0;
		right: 0;
	}

	&-textinput {
		display: inline-block;
		width: 200px;
	}

}
</style>
