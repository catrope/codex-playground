<template>
	<div class="cdx-playground">
		<div class="cdx-playground-column">
			<TemplateNodesEditor :template-nodes="app.template" />
		</div>
		<div class="cdx-playground-column">
			<RenderDynamicApp :app="app" />
			<SourceCode :app="app" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { CdxButton, CdxProgressBar } from '@wikimedia/codex';
import RenderDynamicApp from './RenderDynamicApp.vue';
import SourceCode from './SourceCode.vue';
import TemplateNodesEditor from './TemplateNodesEditor.vue';
import { DynamicApp } from './dynamic-app';

import '@wikimedia/codex/dist/codex.style.css';

export default defineComponent( {
	components: {
		RenderDynamicApp,
		SourceCode,
		TemplateNodesEditor
	},
	setup() {
		const app = reactive( {
			template: [
				{ type: 'html', tag: 'p', attrs: {}, children: [
					{ type: 'text', text: 'Hello world!' }
				] },
				{ type: 'component', component: CdxButton, componentName: 'CdxButton', importFrom: '@wikimedia/codex', props: { action: { type: 'literal', value: 'progressive' } }, events: {}, defaultSlot: [
					{ type: 'text', text: 'Click meeeee!!!!!' }
				] },
				{ type: 'component', component: CdxProgressBar, componentName: 'CdxProgressBar', importFrom: '@wikimedia/codex', props: {}, events: {}, defaultSlot: [] }
			]
		} as DynamicApp );

		return {
			app
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
