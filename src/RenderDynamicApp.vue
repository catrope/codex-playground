<script lang="ts">
import { defineComponent, h } from 'vue';
import { renderTemplate } from './dynamic-app';
import { useStore } from './store';

export default defineComponent( {
	setup() {
		const store = useStore();
		// TODO set up variable state in a way that is somehow reactive to the stuff in app
		return () => h( 'div', { class: 'cdx-playground-render' }, renderTemplate( store.template.children ) );
	}
} );
</script>
