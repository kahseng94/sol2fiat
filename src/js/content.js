//function
function waitForElm(selector) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}
//get sol price from sync storage and return Promise
function getSolPriceFromStorage() {
	const solUSD = chrome.storage.sync.get(["solUSD"]).then((value) => {
		return value.solUSD;
	});

	return solUSD;
}

//insert price element to website
function insertPriceElemToME(elm, solPrice) {
	let nftPriceInSol =
		document.getElementsByClassName("text-white price")[0].innerText;

	//add space between sol price and fiat price
	elm.classList.add("me-2");

	//if the nft is not listed, price elem won't be added to the site
	if (nftPriceInSol !== "Not listed") {
		nftPriceInSol = nftPriceInSol.replace("SOL", "");
		nftPriceInSol = parseFloat(nftPriceInSol * solPrice).toFixed(2);

		//create new element and add it to the DOM
		let fiat = document.createTextNode(` (${nftPriceInSol} USD)`);
		let newElm = document.createElement("span");
		newElm.setAttribute("id", "fiatElm");
		newElm.classList.add("text-gray-500");
		newElm.appendChild(fiat);
		let existingElm = document.getElementById("fiatElm");
		if (!existingElm) {
			elm.insertAdjacentElement("afterend", newElm);
		}
	}
}

//main

waitForElm(".text-white.price").then((elm) => {
	getSolPriceFromStorage().then((solPrice) => {
		insertPriceElemToME(elm, solPrice);
	});
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	let div = document.getElementById("fiatElm");

// 	if (!request.contentCheckedBool) {
// 		div.style.display = "none";
// 		sendResponse("Converter is turned off");
// 	} else {
// 		div.style.display = "block";
// 		sendResponse("Converter is turned on");
// 	}
// });
