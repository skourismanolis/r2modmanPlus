<template>
	<div class='margin-right'>
		<h5 class='subtitle is-7' v-if="stage !== 'main'">
			Mod not installing:
			{{mod.getDisplayName()}} by {{mod.getAuthorName()}}
		</h5>
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
				manually.
			</p>
		</div>
		<div v-else-if="stage === 'bepinex_debug'">
			<h5 class='title is-5'>Errors in the BepInEx console &amp; recent game updates</h5>
			<p>Are there any errors in the BepInEx console?</p>
			<br/>
			<p>
				Errors that appear, and contain the mod name, most likely mean that the mod is broken. There may be
				an update available, or if not, you can check when it was last updated on the Thunderstore page.
			</p>
		</div>
		<div v-else-if="stage === 'incorrect_installation'">
			<h5 class='title is-5'>Did the manager incorrectly install the mod?</h5>
			<p>
				Whilst unlikely, there's a history of older save game mods not working correctly, and text mods that
				don't rely utilise AssetPlus.
			</p>
			<br/>
			<p>
				You can check that the files have been installed correctly
				<Link target='file'
				      :url="profilePath">here.
				</Link>
				The README is also available
				<Link target='file' :url="modFile">here.</Link>
			</p>
			<br/>
			<p>
				If you have discovered a mod that does not install correctly. Please mention me in the
				<Link target='url' :url="'https://discordapp.com/invite/5MbXZvd'">modding discord</Link>
				server using: @Ebkr#3660.
			</p>
		</div>
		<div v-else-if="stage === 'contact_author'">
			<h5 class='title is-5'>Still having trouble?</h5>
			<ol>
				<li>Ensure the previous steps have been followed.</li>
				<li>Make sure you've read the
					<Link target='url' :url='mod.getWebsiteUrl()'>mod's page</Link>
					on
					Thunderstore.
				</li>
				<li>Finally, the author's contact information should appear on the Thunderstore page. You can
					generally use this to mention them in the
					<Link target='url' :url="'https://discordapp.com/invite/5MbXZvd'">modding
						discord
					</Link>
					server.
				</li>
			</ol>
		</div>
		<br/>
		<button class='button' v-if="stage !== 'main'" @click='previousStage()'>Go back</button>
		&nbsp;
		<button class='button is-info' v-if="stage !== 'main'" @click='nextStage()'>Next</button>
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
	import Profile from '../../../model/Profile';

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
		profilePath: string = Profile.getActiveProfile().getPathOfProfile();
		stageProgression: string[] = ['main', 'contains_data', 'bepinex_debug', 'incorrect_installation',
			'contact_author'];

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

		containsDataFolder(mod: ManifestV2) {
			const containsDataFolderResult = ModInfo.modContainsDataFolder(mod);
			if (containsDataFolderResult instanceof R2Error) {
				this.$emit('error', containsDataFolderResult);
				return false;
			}
			return containsDataFolderResult;
		}

		performChecks(mod: any) {
			const manifestMod = new ManifestV2().fromReactive(mod);
			const containsDataFolderResult = this.containsDataFolder(manifestMod);
			if (containsDataFolderResult) {
				this.stage = 'contains_data';
			} else {
				this.stage = 'bepinex_debug';
			}
		}

		nextStage() {
			let index = this.stageProgression.indexOf(this.stage) + 1;
			if (index === this.stageProgression.length) {
				index = 0;
			}
			this.stage = this.stageProgression[index];
		}

		previousStage() {
			let index = this.stageProgression.indexOf(this.stage) - 1;
			if (this.stageProgression[index] === 'contains_data') {
				if (this.mod !== undefined) {
					if (!this.containsDataFolder(this.mod)) {
						index -= 1;
					}
				}
			}
			this.stage = this.stageProgression[index];
		}

		created() {
			if (this.localModList !== undefined) {
				this.modList = [...this.localModList];
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