/*
* Ilan Kleiman
* script.js
* First: 02/17/2018
* Last: MM/DD/YYYY
*/

$(document).ready(function() {
	$.get("get_data.pl?method=get_data&user=shortland", function(data) {
		var DECIMALS_TO_ROUND = 4;
		var LONGER_DECIMALS_TO_ROUND = 12;

		var obj = JSON.parse(data);
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
				"<div class='object'>" +
					"<table class='tblof' style='height:100%;overflow:scroll;'>" +
						"<tr>" +
							"<td rowspan='4' align='center' style='width:100px;height:100%;vertical-align:middle;'>" +
								"<div style='display:inline-block;horizontal-align:center;width:100px !important;'>" +
									"<img src='color/" + obj['wallets'][i]['symbol'].toLowerCase() + ".png' class='sym_pic' />" +
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
	});
});
