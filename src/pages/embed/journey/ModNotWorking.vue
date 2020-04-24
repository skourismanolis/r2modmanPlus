<template>
    <div>
	    <div v-if="stage === 'main'">
		    <h5 class='title is-5'>Which mod is not working?</h5>
		    <div v-for='(key, index) in localModList' :key="'mod-help-selection-' + index">
			    <div class="container">
				    <div class="border-at-bottom">
					    <div class="card is-shadowless">
						    <p class='card-header-title'>{{key.name}}</p>
					    </div>
				    </div>
			    </div>
		    </div>
	    </div>
    </div>
</template>

<script lang='ts'>
	import { Prop, Vue } from 'vue-property-decorator';
	import Component from 'vue-class-component';
	import ManifestV2 from '../../../model/ManifestV2';

	@Component
	export default class ModNotWorking extends Vue {

		stage: string = 'main';
		mod: ManifestV2 | undefined = undefined;

		@Prop()
		private localModList: ManifestV2[] = [];

	}
</script>