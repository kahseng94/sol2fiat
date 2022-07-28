const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;

//function
async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

async function getSolPriceFromApi() {
	//fetch api
	return await fetch(
		"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
	)
		.then((response) => response.json())
		.then((price) => {
			return price.solana.usd;
		});
}

async function storeSolPriceFromApi() {
	let current = new Date();
	let jsonCurrent = current.toJSON();

	getSolPriceFromApi().then((usd) => {
		chrome.storage.sync.set(
			{ solUSD: usd, lastUpdatedTime: jsonCurrent },
			function () {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
				console.log(
					`Current solana price: ${usd}, updated at `,
					current.toLocaleString()
				);
			}
		);
	});
}

//check if last update time is an hour ago and update storage with new price
function checkLastUpdateTime() {
	chrome.storage.sync.get(["lastUpdatedTime"], (result) => {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError.message);
		} else {
			const storedJSONDate = result["lastUpdatedTime"];

			if (storedJSONDate) {
				const lastupdatetime = new Date(storedJSONDate);
				const currenttime = new Date();
				const msec = currenttime.getTime() - lastupdatetime.getTime();
				console.log("Last Updated Time is", msec / MINUTE, "minutes");
				if (msec >= HOUR) storeSolPriceFromApi();
			}
		}
	});
}

function injectScriptToCurrentTab(tabId) {
	chrome.scripting
		.executeScript({
			target: { tabId: tabId },
			files: ["src/js/content.js"],
		})
		.then(function () {
			console.log("ContentScript injected");
		})
		.catch(function (err) {});
}

//event listener
chrome.runtime.onInstalled.addListener(function () {
	console.log("Extension Installed...");
	storeSolPriceFromApi();
	chrome.storage.sync.set({ isOn: true });
	// getCurrentTab().then((tab) => {
	// 	const isME = tab.url.includes("https://magiceden.io/item-details");
	// 	if (isME) {
	// 		injectScriptToCurrentTab(tab.id);
	// 	}
	// });
});

//update when user refresh the current tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	chrome.storage.sync.get(["isOn"]).then((value) => {
		if (value.isOn) {
			const isME = tab.url.includes("https://magiceden.io/item-details");
			if (changeInfo.status == "complete" && isME) {
				checkLastUpdateTime();

				injectScriptToCurrentTab(tabId);
			}
		}
	});
});

//trigger when notified by popup
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	if (request.bkgCheckedBool === true) {
// 		getCurrentTab().then((tab) => {
// 			const isME = tab.url.includes("https://magiceden.io/item-details");
// 			if (isME) {
// 				checkLastUpdateTime();

// 				injectScriptToCurrentTab(tab.id);
// 			}
// 		});

// 		sendResponse("Switch on");
// 	} else {
// 		sendResponse("Switch off");
// 	}
// });

//main
