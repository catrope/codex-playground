<script lang="ts">
import { defineComponent, h, PropType } from 'vue';
import { DynamicApp, renderTemplate } from './dynamic-app';

export default defineComponent( {
	props: {
		app: {
			type: Object as PropType<DynamicApp>,
			required: true
		}
	},
	setup( props ) {
		// TODO set up variable state in a way that is somehow reactive to the stuff in app
		return () => h( 'div', { class: 'cdx-playground-render' }, renderTemplate( props.app.template ) );
	}
} );
</script>
