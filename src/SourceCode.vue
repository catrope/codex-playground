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
import { computed, defineComponent } from 'vue';
import { makeTemplateSource, makeScriptSource } from './dynamic-app';
import { useStore } from './store';
export default defineComponent( {
	setup() {
		const store = useStore();
		const templateSource = computed( () => makeTemplateSource( store.template.children ) );
		const scriptSource = computed( () => makeScriptSource( store ) );
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
