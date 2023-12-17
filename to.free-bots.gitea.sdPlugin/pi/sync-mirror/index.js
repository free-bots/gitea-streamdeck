/// <reference path="../../libs/js/property-inspector.js" />
/// <reference path="../../libs/js/action.js" />
/// <reference path="../../libs/js/utils.js" />

console.log('Property Inspector loaded', $PI);

$PI.onConnected(jsn => {
	console.log('Property Inspector connected', jsn);
	console.log(jsn.actionInfo.payload.settings);
	Object.entries(jsn.actionInfo.payload.settings).forEach(([key, value]) => {
		console.log('setting', key, value);
		const el = document.getElementById(key);
		if (el) {
			el.value = value;
		}
	});
});

const changed = () => {
	console.log('changed', event, event.target, event.target.value);
	$PI.sendToPlugin({ key: event.target.id, value: event.target.value });
};
