import ManifestV2 from '../../model/ManifestV2';
import * as path from 'path';
import PathResolver from '../manager/PathResolver';
import BepInExTree from '../../model/file/BepInExTree';
import R2Error from '../../model/errors/R2Error';

export default class ModInfo {
	
	public static modContainsDataFolder(mod: ManifestV2): R2Error | boolean {
		const tree: BepInExTree | R2Error = BepInExTree.buildFromLocation(this.getModCacheFolder(mod));
		if (tree instanceof R2Error) {
			return tree;
		}
		const dataFolders = tree.getRecursiveDirectoryNames()
			.filter(name => name === 'Risk of Rain 2_Data');
		if (dataFolders.length > 0) {
			return true;
		}
		return false;
	}
	
	public static getModCacheFolder(mod: ManifestV2): string {
		return path.join(PathResolver.ROOT, 'mods', 'cache', mod.getName(), mod.getVersionNumber().toString());
	}
	
}