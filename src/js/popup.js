chrome.storage.sync.get("isOn", function (value) {
	let element = document.getElementById("togglebutton");
	if (value.isOn) {
		element.setAttribute("checked", "");
	} else {
		element.removeAttribute("checked");
	}
});

//event listener
let element = document.getElementById("togglebutton");
element.addEventListener("change", function () {
	let isChecked = element.checked;

	chrome.storage.sync.set({ isOn: isChecked }, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError.message);
		} else {
			console.log(`isChecked=${isChecked} saved in storage`);
		}
	});

	//send msg to notify bkg when switch is changed
	// chrome.runtime.sendMessage(
	// 	{ bkgCheckedBool: isChecked },
	// 	function (response) {
	// 		console.log(response);
	// 	}
	// );

	// //send msg to notify content when switch is changed
	// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	// 	chrome.tabs.sendMessage(
	// 		tabs[0].id,
	// 		{ contentCheckedBool: isChecked },
	// 		function (response) {
	// 			if (chrome.runtime.lastError) {
	// 				console.error("From popup: ", chrome.runtime.lastError.message);
	// 			} else {
	// 				console.log(response);
	// 			}
	// 		}
	// 	);
	// });
});
