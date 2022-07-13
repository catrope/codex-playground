<template>
	<div class="cdx-playground">
		<div class="cdx-playground-column">
			<TemplateNodeEditor :node="rootNode" />
		</div>
		<div class="cdx-playground-column">
			<RenderDynamicApp />
			<SourceCode />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RenderDynamicApp from './RenderDynamicApp.vue';
import SourceCode from './SourceCode.vue';
import TemplateNodeEditor from './TemplateNodeEditor.vue';

import '@wikimedia/codex/dist/codex.style.css';
import { useStore } from './store';

export default defineComponent( {
	components: {
		RenderDynamicApp,
		SourceCode,
		TemplateNodeEditor
	},
	setup() {
		const store = useStore();
		const rootNode = store.template;
		return {
			rootNode
		};
	}
} );
</script>

<style lang="less">
.cdx-playground {
	display: flex;
	height: 100%;
	box-sizing: border-box;

	&-column {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.cdx-playground-render {
		flex-grow: 1;
	}
}
</style>
