<template>
	<div class="cdx-playground">
		<p>
			Hello world #{{ num }}!
		</p>
		<button @click="onMoreClick">
			More
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent( {
	setup() {
		const num = ref( 1 );
		const onMoreClick = () => num.value++;

		return {
			num,
			onMoreClick
		};
	}
} );
</script>

<style lang="less">
.cdx-playground {
	button {
		font-style: italic;
	}
}
</style>
