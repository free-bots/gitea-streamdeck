import streamDeck, { action, ActionEvent, DidReceiveSettingsEvent, KeyDownEvent, SendToPluginEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import axios from 'axios';
const logger = streamDeck.logger.createScope("SyncMirror");

@action({ UUID: "to.free-bots.gitea.sync-mirror" })
export class SyncMirror extends SingletonAction<SyncSettings> {

	async onWillAppear(ev: WillAppearEvent<SyncSettings>): Promise<void> {
		await this.updateTitle(ev);
	}

	async onKeyDown(ev: KeyDownEvent<SyncSettings>): Promise<void> {
		try {
			await this.sync(ev.payload.settings);
			logger.info('Synced repo');
			ev.action.showOk();
		} catch (error) {
			logger.error('Error while syncing', error)
			ev.action.showAlert();
		}
	}

	async onSendToPlugin(ev: SendToPluginEvent<object, SyncSettings>): Promise<void> {
		const { key, value } = ev.payload as { key: string, value: string };
		const settings = await ev.action.getSettings();
		await ev.action.setSettings({
			...settings,
			[key]: value,
		})
	}

	async onDidReceiveSettings(ev: DidReceiveSettingsEvent<SyncSettings>): Promise<void> {
		await this.updateTitle(ev);
	}

	private async sync(settings: SyncSettings): Promise<void> {
		const url = `${settings.url}/repos/${settings.repo}/mirror-sync?token=${settings.token}`;
		logger.info(`Calling gitea for repo: ${settings.repo}`);
		await axios.post(url, {});
	}

	private async updateTitle(ev: ActionEvent<any, SyncSettings>): Promise<void> {
		const settings = await ev.action.getSettings();
		const title = settings.repo?.split('/').join('\n');
		await ev.action.setTitle(title);
	}
}

type SyncSettings = {
	token: string;
	url: string;
	repo: string;
};
