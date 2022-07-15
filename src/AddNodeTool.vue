<template>
	<div class="cdx-playground-toolbar">
		<CdxButton @click="menuExpanded = !menuExpanded" @blur="menuExpanded = false">
			<CdxIcon :icon="cdxIconAdd" />
		</CdxButton>
		<CdxMenu
			v-model:expanded="menuExpanded"
			:menu-items="componentAndTagMenuItems"
			:selected="null"
			@update:selected="addNode"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getComponentDefinition, makeComponentNode, makeHtmlNode, NonRootTemplateNode, useStore } from './store';
import { CdxButton, CdxIcon, CdxMenu, MenuItemData } from '@wikimedia/codex';
import { cdxIconAdd } from '@wikimedia/codex-icons';
import availableComponents from './available-components';

// TODO deduplicate these three with TemplateNodeEditor.vue
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
	components: {
		CdxButton,
		CdxIcon,
		CdxMenu
	},
	props: {
		index: {
			type: Number,
			required: true
		}
	},
	setup( props ) {
		const store = useStore();
		const menuExpanded = ref( false );

		function addNode( componentOrTag: string ) {
			let newNode: NonRootTemplateNode;
			if ( getComponentDefinition( componentOrTag ) ) {
				newNode = makeComponentNode( componentOrTag, store.variables );
			} else {
				newNode = makeHtmlNode( componentOrTag );
			}
			store.template.children.splice( props.index + 1, 0, newNode );
		}

		return {
			componentAndTagMenuItems,
			menuExpanded,
			addNode,
			cdxIconAdd
		};
	}
} );
</script>

<style lang="less">
.cdx-playground-toolbar {
	position: relative;

	.cdx-menu {
		width: auto;
	}
}
</style>
