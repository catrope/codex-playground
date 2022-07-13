<!-- eslint-disable vue/no-mutating-props -->
<template>
	<div class="cdx-playground-editor">
		<div v-if="node.type === 'component'">
			Component:
			<CdxSelect
				:selected="node.component"
				:menu-items="componentMenuItems"
				@update:selected="switchComponent"
			/>
		</div>
		<div v-if="node.type === 'html'">
			HTML tag:
			<CdxSelect v-model:selected="node.tag" :menu-items="tagMenuItems" />
		</div>
		<div v-if="node.type === 'text'">
			Text:
			<CdxTextInput v-model="node.text" class="cdx-playground-editor-input" />
		</div>
		<div v-if="'children' in node">
			<div
				v-for="( child, index ) in node.children"
				:key="index"
				class="cdx-playground-editor-children"
			>
				<TemplateNodeEditor :node="child" />
				<CdxButton action="destructive" @click="removeChild( index )">
					<CdxIcon :icon="cdxIconTrash" />
				</CdxButton>
			</div>
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
/* eslint-disable vue/no-mutating-props */
import { defineComponent, PropType } from 'vue';
import { makeComponentNode, makeHtmlNode, makeTextNode, TemplateNode } from './store';
import availableComponents from './available-components';
import { CdxButton, CdxIcon, CdxTextInput, CdxSelect, MenuItemData } from '@wikimedia/codex';
import { cdxIconAdd, cdxIconTrash } from '@wikimedia/codex-icons';

export default defineComponent( {
	name: 'TemplateNodeEditor',
	components: {
		CdxButton,
		CdxIcon,
		CdxTextInput,
		CdxSelect
	},
	props: {
		node: {
			type: Object as PropType<TemplateNode>,
			required: true
		}
	},
	setup( props ) {
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

		function switchComponent( newComponentName: string ) {
			if ( props.node.type !== 'component' ) {
				return;
			}
			const newComponentNode = makeComponentNode( newComponentName );
			props.node.component = newComponentName;
			props.node.props = newComponentNode.props;
			props.node.children = newComponentNode.children;
		}

		function addComponent() {
			if ( !( 'children' in props.node ) ) {
				return;
			}
			props.node.children.push( makeComponentNode( 'CdxButton' ) );
		}

		function addHtml() {
			if ( !( 'children' in props.node ) ) {
				return;
			}
			props.node.children.push( makeHtmlNode( 'p' ) );
		}

		function addText() {
			if ( !( 'children' in props.node ) ) {
				return;
			}
			props.node.children.push( makeTextNode( 'Hello' ) );
		}

		function removeChild( index: number ) {
			if ( !( 'children' in props.node ) ) {
				return;
			}
			props.node.children.splice( index, 1 );
		}

		return {
			tagMenuItems,
			componentMenuItems,
			switchComponent,
			addComponent,
			addHtml,
			addText,
			removeChild,
			cdxIconAdd,
			cdxIconTrash
		};
	}
} );
</script>

<style lang="less">
.cdx-playground-editor {
	margin-left: 1em;

	&-input {
		display: inline-block;
		width: 200px;
	}

	&-children {
		display: flex;
		align-items: flex-start;
	}

}
</style>
