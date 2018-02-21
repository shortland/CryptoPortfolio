/*
* Ilan Kleiman
* script.js
* First: 02/17/2018
* Last: MM/DD/YYYY
*/

// holds the fetched user data.
// global variable cus we fetch it in one function, but use it in others without passing it as a parameter.
var obj; 
var max_count = 0;

$(document).ready(function() {
	$.get("get_data.pl?method=get_data&user=shortland", function(data) {
		var DECIMALS_TO_ROUND = 4;
		var LONGER_DECIMALS_TO_ROUND = 12;

		obj = JSON.parse(data);

		// sort the view based on the usd_price per 1 coin
		// allow user to customize this later on?
		obj['wallets'].sort(function(a, b) {
			return b.usd_price - a.usd_price; 
		});

		var total_value = obj['usd_value'];
		var total_value_btc = obj['btc_value'];

		$("#add_content").click(function() {
			if ($("#add_content").html() == "+") {
				$("#add_content").html("-");
				$("#add_content").css({"background-color" : "rgba(255, 255, 255, 1.0)", "color" : "rgba(10, 86, 208, 1.0)"});
				$("#adder").show();
				$("#adder").animate({"height" : "150px"}, 800);
			}
			else {
				$("#add_content").html("+");
				$("#add_content").css({"color" : "rgba(255, 255, 255, 1.0)", "background-color" : "rgba(10, 86, 208, 1.0)"});
				$("#adder").animate({"height" : "0px"}, 800, function() {
					$("#adder").hide();
				});
			}
		});

		$("#content").append(
			"<div class='object' style='height:130px;padding-left:20px;box-sizing: border-box;'>" +
				"<h3 style='text-decoration:underline'>Balance</h3>" +
				"<p>&nbsp;&nbsp;&nbsp;&nbsp;USD: $" + total_value + "</p>" + 
				"<p>&nbsp;&nbsp;&nbsp;&nbsp;BTC: " + total_value_btc + "</p>" + 
			"</div>"
		);

		$("#content").append(`
			<div id='adder' style='display:none;height:0px;'>
			</br>
				<center>
					<table border='0px'>
						<tr>
							<td>Symbol:</td>
							<td><input class='textbox' id='symbol_value' type='text' placeholder=' BTC'/></td>
						</tr>
						<tr>
							<td>Location:</td>
							<td><input class='textbox' id='location_value' type='text' placeholder=' Coinbase'/></td>
						</tr>
						<tr>
							<td>Amount:</td>
							<td><input class='textbox' id='amt_value' type='text' placeholder=' 0.08324'/></td>
						</tr>
						<tr>
							<td tdspan='2'><button type='button' id='save_adder'>Save</button></td>
						</tr>
					</table>
				</center>
			</div>
		`);

		for (var i = 0; i < obj['wallets'].length; i++) {
			$("#content").append(
				'<div class=\'object\' id="parent_of_main_' + i + '" style="background-color:rgba(255, 255, 255, 0.0)">' +
					"<table class='main_parent_" + i + " tblof' style='height:100%;overflow:scroll;'>" +
						"<tr>" +
							"<td rowspan='4' align='center' style='width:100px;height:100%;vertical-align:middle;'>" +
								"<div id='remove_bg_plz_" + i + "' colorify_main_color_" + i + " style='display:inline-block;horizontal-align:center;width:100px !important;'>" +
									"<img colorify_" + i + " src='color/" + obj['wallets'][i]['symbol'].toLowerCase() + ".png' class='sym_pic' />" +
								"</div>" +
							"</td>" + 
							"<td><div class='wide150'>Name: " + obj['wallets'][i]['name'] + "</div></td>" +
							"<td style='min-width:250px;'>Price <small>(USD)</small>: $" + (obj['wallets'][i]['usd_price']) + "</td>" +
							
						"</tr>" + 
						"<tr>" +
							// sym.img
							"<td><div class='wide150'>Symbol: " + obj['wallets'][i]['symbol'] + "</div></td>" +
							"<td style='min-width:250px;'>Price <small>(BTC)</small>: " + (obj['wallets'][i]['btc_price']) + "</td>" +
						"</tr>" + 
						"<tr>" +
							// sym.img
							"<td><div class='wide150'>Wallet: " + obj['wallets'][i]['location'] + "</div></td>" +
							"<td style='min-width:250px;'>Value <small>(USD)</small>: $" + (obj['wallets'][i]['usd_value']) + "</td>" +
						"</tr>" + 
						"<tr>" +
							// sym.img
							"<td><div class='wide150'>Amount: " + parseFloat(obj['wallets'][i]['amt']).toFixed(DECIMALS_TO_ROUND) + "</div></td>" +
							"<td style='min-width:250px;'>Value <small>(BTC)</small>: " + (obj['wallets'][i]['btc_value']) + "</td>" +
						"</tr>" + 
					"</table>" +
				"</div>"
			);
		}

		$(".object").css({"width" : $(window).width()});

		$("#save_adder").click(function() {
			$.post("get_data.pl", {method: "post_data", user: "shortland", symbol: $("#symbol_value").val(), amt: $("#amt_value").val(), location: $("#location_value").val()}, function(data) {
				alert(data);
			});
		});
	}).done(function() {
		colorify_them();
	});

	function colorify_them() {
		if (max_count == 10) {
			alert("reached max");
			return;
		}
		max_count++;
		for (var i = 0; i < obj['wallets'].length; i++) {
			colorify({
				id: i,
				container: "colorify_main_color_" + i,
				accuracy: 1,
				attr: 'colorify_' + i,
				give: {
					property: 'background-color',
					target: '.main_parent_' + i
				}
			});
		}
		if ($(".main_parent_0").css('backgroundColor') == "rgba(0, 0, 0, 0)") {
			// for some reason this works with 0 delay.
			// outright calling the function doesn't work.
			setTimeout(colorify_them, 0);
		}
		else {
			setTimeout(remove_unwanted_bg, 0);
		}
	}

	function remove_unwanted_bg() {
		for (var i = 0; i < obj['wallets'].length; i++) {
			$('#remove_bg_plz_' + i).children().css({"background-color" : "rgba(255, 255, 255, 0.0)"});
		}
	}
});
