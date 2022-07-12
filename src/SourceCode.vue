<template>
	<div class="cdx-playground-sourcecode">
		<pre>
&lt;template&gt;
{{ templateSource }}
&lt;/template&gt;

&lt;script&gt;
{{ scriptSource }}
&lt;/script&gt;
		</pre>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { DynamicApp, makeTemplateSource, makeScriptSource } from './dynamic-app';
export default defineComponent( {
	props: {
		app: {
			type: Object as PropType<DynamicApp>,
			required: true
		}
	},
	setup( props ) {
		const templateSource = computed( () => makeTemplateSource( props.app.template ) );
		const scriptSource = computed( () => makeScriptSource( props.app ) );
		return {
			templateSource,
			scriptSource
		};
	}
} );
</script>

<style lang="less">
.cdx-playground-sourcecode {
	pre {
		margin: 0;
	}

}
</style>
