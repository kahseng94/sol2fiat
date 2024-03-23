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
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
			return;
		}
		return value.solUSD;
	});

	return solUSD;
}

//insert price element to website
function insertPriceElemToME(elm, solPrice, idName) {
	let nftPriceInSol =
		document.getElementsByClassName("text-white price")[0].innerText;

	let notListedElement =
		document.getElementsByClassName("text-white price")[0].innerText;

	let elmPrice = 0;

	if (elm.querySelector(".tw-text-white-1")) {
		elmPrice = elm.querySelector(".tw-text-white-1").innerText;
	} else {
		elmPrice = elm.querySelector("span").innerText;
	}

	//console.log("testing", takerFeeInSol.children[1].innerText);
	console.log("testing", elm.parentElement);
	console.log("testing2", elm.querySelector(".tw-text-white-1"));

	//if the nft is not listed, price elem won't be added to the site
	if (notListedElement !== "Not listed") {
		//nftPriceInSol = nftPriceInSol.replace("SOL", "");
		elmPrice = parseFloat(elmPrice * solPrice).toFixed(2);

		//create new element and add it to the DOM
		let fiat = document.createTextNode(` (${elmPrice} USD)`);
		let newElm = document.createElement("span");
		newElm.setAttribute("id", idName);
		newElm.classList.add("text-gray-500");
		newElm.appendChild(fiat);

		if (idName === "totalFiat") {
			newElm.classList.add("tw-text-sm");
		}

		let existingElm = document.getElementById(idName);
		if (!existingElm) {
			//elm.insertAdjacentElement("afterend", newElm);
			elm.insertAdjacentElement("beforeend", newElm);
		}
	}
}

//main

waitForElm(".text-white.price").then((elm) => {
	getSolPriceFromStorage().then((solPrice) => {
		let priceNodeList = document.querySelectorAll(
			"span.tw-flex.tw-items-center.tw-gap-1"
		);
		let priceInSol = priceNodeList[0];

		let takerFeeInSol = priceNodeList[1];

		let royaltyInSol = priceNodeList[2];

		let totalPriceInSol = priceNodeList[3];

		insertPriceElemToME(priceInSol, solPrice, "priceFiat");
		insertPriceElemToME(takerFeeInSol, solPrice, "takerFeeFiat");
		insertPriceElemToME(royaltyInSol, solPrice, "royaltyFiat");
		insertPriceElemToME(totalPriceInSol, solPrice, "totalFiat");
	});
});
