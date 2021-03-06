$(document).ready(function() {
	
	//toggle on/off
	SetToggleButton();
	const path = "data.json";
	LoadCollection(path);
	

	function SetToggleButton() {
		chrome.storage.sync.get('isDisabled', function(result) {
			// console.log(result.isDisabled);
			if (result.isDisabled === false) {
				const toggleButtonHtml = $('<input id="toggle-button" type="checkbox" name="on-off-checkbox" checked>');
				$("#on-off-div").append(toggleButtonHtml);
				$("[name='on-off-checkbox']").bootstrapSwitch();
			}
			else {
				const toggleButtonHtml = $('<input id="toggle-button" type="checkbox" name="on-off-checkbox">');
				$("#on-off-div").append(toggleButtonHtml);
				$("[name='on-off-checkbox']").bootstrapSwitch();
				$("#select-char").attr("disabled", true);
			}
			//enable toggling
			SwitchChange();
		});
		
	}

	function SwitchChange() {

		console.log($("[name='on-off-checkbox']"));
		
		$("[name='on-off-checkbox']").on('switchChange.bootstrapSwitch', function (event, state) {
	   		if (state === false) {
	   			// console.log("false");
	   			$("#select-char").attr("disabled", true);
	   			$("#collection").empty();
	   			$("#button-value")[0].innerText = "Character ";

	   			chrome.storage.sync.get('prevImage', function(result) {
	   				chrome.storage.sync.set({'charUrl': result.prevImage}, function() {
	   					return true;
	   				});
					
	   			});
	   			chrome.storage.sync.set({'isDisabled': true}, function() {
	   				return true;
	   			});
	   		}
	   		else {
	   			// console.log("true");
	   			$("#select-char").attr("disabled", false);
	   			chrome.storage.sync.get('prevImage', function(result) {
	   				chrome.storage.sync.set({'charUrl': result.prevImage}, function() {
	   					return true;
	   				});
	   			});

	   			chrome.storage.sync.set({'isDisabled': false}, function() {
	   				return true;
	   			});

	   		}
		});
	}
	

	// get images collection from data.json and show in popup
	function LoadCollection(path) {
		$.ajax({
		    url : path,
		    success: function (responseData) {
		    	const parsedData = JSON.parse(responseData);
		    	const charList = parsedData.characters_list;
		    	const characters = parsedData.characters;
		    	for (let key in charList) {
		    		const dropdownHtml = '<li><a href="#">' + charList[key] + '</a></li>'
		    		$(".dropdown-menu").append(dropdownHtml);
		    	}
		    	$("li").click(function(v) {
		    		//change button name to the character's
		    		$("#button-value")[0].innerText = v.target.innerText + " ";
		    		//reload collection
		    		$("#collection").empty();
		    		LoadCharacter(characters, v.target.innerText);
		    		$(".img-col").click(function(v) {
		    			SaveCurrentCharacterUrl(v.target.src);
		    		});
		    	})
		    }
		});
	}

	//load char images of the selected char
	function LoadCharacter(characters, name) {
		const charImages = FindCharacter(characters, name)[0].images;
		for (let key in charImages) {
			const collectionHtml = '<div class="col-xs-4"><img class="img-col" src=' + charImages[key] + '></div>';
			$("#collection").append(collectionHtml);
		}
	}

	function FindCharacter(characters, name) {
		return characters.filter(function(data) {
			return data.name == name;
		})
	}

	//save the current char img into local storage
	function SaveCurrentCharacterUrl(url) {
		chrome.storage.sync.set({'charUrl': url}, function() {
			return true;
		});
	}
});