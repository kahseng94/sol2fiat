chrome.storage.sync.get("isOn", function (value) {
	if (chrome.runtime.lastError) {
		console.log(chrome.runtime.lastError.message);
		return;
	}
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
});
