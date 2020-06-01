<template>
	<div class='margin-right'>
		<p>Test</p>
	</div>
</template>

<script lang='ts'>
	import { Prop, Vue } from 'vue-property-decorator';
	import ManifestV2 from '../../../model/ManifestV2';

	export default class GameWontStart extends Vue {

		stage: string = 'main'

		created() {
			this.stage = 'main';
		}
	}
</script>