<template>
	<div class="cdx-playground-variables-editor">
		<h3>Variables</h3>
		<ul>
			<li
				v-for="( variable, index ) in variables"
				:key="variable.name"
			>
				{{ variable.name }}:
				<CdxTextInput
					v-if="isEditing( index )"
					v-model="variable.value"
					class="cdx-playground-variables-editor-textinput"
				/>
				<code v-else-if="variable.value">
					{{ variable.value }}
				</code>
				<em v-else>
					(empty)
				</em>
				<CdxButton @click="toggleEditing( index )">
					<CdxIcon :icon="isEditing( index ) ? cdxIconCheck : cdxIconEdit" />
				</CdxButton>
				<CdxButton @click="remove( index )">
					<CdxIcon :icon="cdxIconTrash" />
				</CdxButton>
			</li>
		</ul>
		<div class="cdx-playground-variables-editor-add">
			<template v-if="addingVariable">
				Variable name:
				<CdxTextInput
					v-model="addingVariableName"
					class="cdx-playground-variables-editor-textinput"
				/>
				<CdxButton
					:disabled="variables.find( ( v ) => v.name === addingVariableName )"
					@click="addVariable"
				>
					Add
				</CdxButton>
			</template>
			<CdxButton
				v-else
				@click="addingVariable = true"
			>
				<CdxIcon :icon="cdxIconAdd" />
				Add variable
			</CdxButton>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { CdxButton, CdxIcon, CdxTextInput } from '@wikimedia/codex';
import { cdxIconAdd, cdxIconCheck, cdxIconEdit, cdxIconTrash } from '@wikimedia/codex-icons';
import { useStore } from './store';

export default defineComponent( {
	components: {
		CdxButton,
		CdxIcon,
		CdxTextInput
	},
	setup() {
		const store = useStore();
		const variables = computed( () => store.variables );
		const editingIndexes = ref( new Set<number>() );
		const addingVariable = ref( false );
		const addingVariableName = ref( '' );

		function isEditing( index: number ) {
			return editingIndexes.value.has( index );
		}

		function startEditing( index: number ) {
			editingIndexes.value.add( index );
		}

		function stopEditing( index: number ) {
			editingIndexes.value.delete( index );
		}

		function toggleEditing( index: number ) {
			if ( isEditing( index ) ) {
				stopEditing( index );
			} else {
				startEditing( index );
			}
		}

		function remove( index: number ) {
			// TODO make this a store action
			store.variables.splice( index, 1 );
		}

		function addVariable() {
			store.variables.push( { name: addingVariableName.value, value: '' } );
			addingVariableName.value = '';
			addingVariable.value = false;
		}

		return {
			variables,
			addingVariable,
			addingVariableName,
			isEditing,
			toggleEditing,
			remove,
			addVariable,
			cdxIconAdd,
			cdxIconCheck,
			cdxIconEdit,
			cdxIconTrash
		};
	}
} );
</script>

<style lang="less">
.cdx-playground-variables-editor {
	&-textinput {
		display: inline-block;
		width: 200px;
	}
}
</style>
