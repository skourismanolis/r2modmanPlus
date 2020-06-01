<template>
	<div>
		<hero title='Modding help' subtitle='Mod problems? Game problems? Manager problems?' heroType='is-info'/>
		<div class='columns'>
			<div class="column is-one-quarter">
				<aside class="menu">
					<p class='menu-label'>Help sections</p>
					<ul class="menu-list">
						<li>
							<a @click="view = 'general'" :class="[view === 'general' ? 'is-active' : '']">
								General
							</a>
						</li>
						<li>
							<a @click="view = 'mods_not_working'" :class="[view === 'mods_not_working' ? 'is-active' : '']">
								Mods not installing
							</a>
						</li>
						<li>
							<a @click="view = 'game_not_starting'" :class="[view === 'game_not_starting' ? 'is-active' : '']">
								Game not starting
							</a>
						</li>
						<li>
							<a @click="view = 'common_errors'" :class="[view === 'common_errors' ? 'is-active' : '']">
								Common errors
							</a>
						</li>
						<li>
							<a @click="view = 'tips_and_tricks'" :class="[view === 'tips_and_tricks' ? 'is-active' : '']">
								Tips and tricks
							</a>
						</li>
					</ul>
				</aside>
			</div>
			<div class="column is-three-quarters">
				<br/>
				<div class="container">
					<div v-if="view === 'general'">
						<h5 class='title is-5'>Setting the Steam and Risk of Rain 2 directories</h5>
						<p>Don't.</p>
						<p>
							But really, only use them if you're getting problems where the manager can't detect it.
							It'll
							attempt to run a command to find the Steam installation location. From there, it can
							determine your Risk of Rain 2 installation.
						</p>
						<br/>
						<p>If you've set it and are getting problems:</p>
						<ol>
							<li>Browse the data folder on the Settings page</li>
							<li>Close the manager</li>
							<li>Delete the config directory.</li>
						</ol>
						<br/>
					</div>
					<div v-if="view === 'mods_not_working'">
						<mod-not-working
								:local-mod-list='localModList'/>
					</div>
					<div v-if="view === 'game_not_starting'">
						<game-wont-start
								:local-mod-list='localModList'/>
					</div>
					<div v-if="view === 'common_errors'">
						<h5 class='title is-5'>Join path of null</h5>
						<p>This is caused by a problem within the config file. The easiest solution is to perform the
							following steps:
						</p>
						<ol>
							<li>Browse the data folder on the Settings page</li>
							<li>Close the manager</li>
							<li>Delete the config directory.</li>
						</ol>
						<br/>
						<p>
							Manually setting the Risk of Rain 2 directory may also fix this, although hasn't been
							tested
						</p>
					</div>
					<div v-if="view === 'tips_and_tricks'">
						<h5 class='title is-5'>Launching through Steam</h5>
						<p>
							Launching through Steam will mean that none of your mods will be used. It's recommended to
							keep it this way, and to always launch using the manager.
						</p>
						<p>
							If you really want to, you can do so by adding Risk of Rain 2 as a non-steam game, and
							passing in the following launch parameters:
						</p>
						<code>--doorstop-enable true --doorstop-target
							r2modman/BepInEx\core\BepInEx.Preloader.dll</code>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue';
	import Component from 'vue-class-component';
	import { Hero } from 'src/components/all';
	import ModNotWorking from 'src/pages/embed/journey/ModNotWorking.vue';
	import { Prop } from 'vue-property-decorator';
	import ManifestV2 from '../../model/ManifestV2';
	import GameWontStart from './journey/GameWontStart.vue';

	@Component({
		components: {
			'hero': Hero,
			'mod-not-working': ModNotWorking,
			'game-wont-start': GameWontStart
		}
	})
	export default class Help extends Vue {

		private view: string = 'general';

		@Prop({ default: [] })
		private localModList: ManifestV2[] | undefined = undefined;

		beforeDestroy() {
			this.view = 'general';
		}

	}
</script>