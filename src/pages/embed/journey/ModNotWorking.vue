<template>
	<div class='margin-right'>
		<div v-if="stage === 'main'">
			<h5 class='title is-5'>Which mod is not working?</h5>
			<div v-for='(key, index) in modList' :key="'mod-help-selection-' + index">
				<a @click="() => {mod = key; performChecks(key);}">
					<div class="container">
						<div class="border-at-bottom">
							<div class="card is-shadowless">
								<p class='card-header-title'>{{key.getDisplayName()}} by {{key.getAuthorName()}}</p>
							</div>
						</div>
					</div>
				</a>
			</div>
		</div>
		<div v-else-if="stage === 'contains_data'">
			<div class='container'>
				<div class='notification is-warning'>
					<p>{{mod.getDisplayName()}} contains a "Risk of Rain 2_Data" folder.</p>
				</div>
			</div>
			<br/>
			<p>This means that potentially not all files have been installed. r2modman doesn't touch your Risk of Rain
				2_Data folder, and mods that require this (a very limited set of mods), will need you to manually
				replace the files.
			</p>
			<br/>
			<p>
				It's quite easy to do though, don't worry!
				<br/>
				<Link target='file' :url="modFile">Click here</Link>
				to open the mod folder, and
				<Link target='file' :url="riskOfRain2DataFolder">click here</Link>
				to open the Risk of Rain
				2_Data folder.
			</p>
			<br/>
			<ol>
				<li>Find the Risk of Rain 2_Data folder inside the mod folder.</li>
				<li>Drag the contents of that folder into the game's Risk of Rain 2_Data folder.</li>
				<li>Done. Try launching the game again</li>
			</ol>
			<br/>
			<p>Note, uninstalling the mod from r2modman will not remove these files. You will have to do this
				manually.</p>
		</div>
	</div>
</template>

<script lang='ts'>
	import { Prop, Vue, Watch } from 'vue-property-decorator';
	import Component from 'vue-class-component';
	import ManifestV2 from '../../../model/ManifestV2';
	import ModInfo from '../../../r2mm/mods/ModInfo';
	import R2Error from '../../../model/errors/R2Error';
	import { Link } from 'src/components/all';
	import GameDirectoryResolver from '../../../r2mm/manager/GameDirectoryResolver';
	import * as path from 'path';

	@Component(
		{
			components: {
				Link
			}
		}
	)
	export default class ModNotWorking extends Vue {

		stage: string = 'main';
		mod: ManifestV2 | undefined = undefined;
		modFile: string = '';
		riskOfRain2DataFolder: string = '';

		@Watch('stage')
		modWatcher() {
			if (this.mod === undefined) {
				this.modFile = '';
			} else {
				console.log(ModInfo.getModCacheFolder(this.mod));
				this.modFile = ModInfo.getModCacheFolder(this.mod);
			}
		}

		@Prop({ default: [] })
		private localModList: ManifestV2[] | undefined;

		private modList: ManifestV2[] = [];

		performChecks(mod: any) {
			const manifestMod = new ManifestV2().fromReactive(mod);
			const containsDataFolderResult = ModInfo.modContainsDataFolder(manifestMod);
			if (containsDataFolderResult instanceof R2Error) {
				this.$emit('error', containsDataFolderResult);
			}
			if (containsDataFolderResult) {
				this.stage = 'contains_data';
			} else {
				this.stage = 'thunderstore_link';
			}
		}

		created() {
			if (this.localModList !== undefined) {
				this.modList = [...this.localModList]
				this.modList.sort((a, b) => a.getDisplayName().localeCompare(b.getDisplayName()));
			}
			const ror2Folder: string | R2Error = GameDirectoryResolver.getDirectory();
			if (ror2Folder instanceof R2Error) {
				this.$emit('error', ror2Folder);
			} else {
				this.riskOfRain2DataFolder = path.join(ror2Folder, 'Risk of Rain 2_Data');
			}
		}

	}
</script>