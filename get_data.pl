#!/usr/bin/perl

use strict;
use warnings;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use JSON;
use Path::Tiny;
use HTTP::Request;
use LWP::UserAgent;

use Data::Dumper;

sub get_cmc_data {
	my $API_URL = "https://api.coinmarketcap.com/v1/ticker/";
	my $request = HTTP::Request->new(GET => $API_URL);
	my $ua = LWP::UserAgent->new;
	my $response = $ua->request($request)->content();
}

sub reprocess_add_prices {
	my ($data) = @_;
	$data = decode_json($data);
	my $cmc_data = decode_json(get_cmc_data());
	my $wallets_data = $data->{wallets};
	foreach my $hash (@{$wallets_data}) {
		my $cmc_usd_price;
		my $cmc_btc_price;
		my $cmc_name;
		# gets the prices of the necessary symbols
		foreach my $hashes (@{$cmc_data}) {
			if ($hashes->{symbol} eq $hash->{symbol}) {
				$cmc_usd_price = $hashes->{price_usd};
				$cmc_btc_price = $hashes->{price_btc};
				$cmc_name = $hashes->{name};
				last;
			}
		}
		# set the USD and BTC price for each coin in each wallet & the whole value of each wallet
		$hash->{name} = $cmc_name;
		$hash->{usd_price} = $cmc_usd_price;
		$hash->{btc_price} = $cmc_btc_price;
		$hash->{usd_value} = $cmc_usd_price * $hash->{amt};
		$hash->{btc_value} = $cmc_btc_price * $hash->{amt};
		# set the whole value of all wallets
		$data->{usd_value} += $hash->{usd_value};
		$data->{btc_value} += $hash->{btc_value};
	}
	return $data;
}

sub read_validate_file {
	my ($path, $file) = @_;
	if (!path($path . "/" . $file . ".json")->exists) {
		print "file doesn't exist\n";
		exit;
	}
	return path($path . "/" . $file . ".json")->slurp;
}

sub reformat_insert_data {
	my ($data, $q) = @_;
	$data = decode_json($data);
	my @wallets_data = @{$data->{wallets}};
	my %hash = (
		symbol => uc($q->param("symbol")),
		amt => $q->param("amt"),
		location => $q->param("location"),
	);
	push(@wallets_data, \%hash);
	$data->{wallets} = \@wallets_data;
	return encode_json($data);
}

sub get_my_info {
	my ($path, $user) = @_;
	print encode_json(
		reprocess_add_prices(
			read_validate_file($path, $user)
	));
}

sub input_new_info {
	my ($path, $user, $q) = @_;
	chmod 0777, $path;
	chmod 0777, $path . '/' . $user . '.json';
	#path($path . '/' . $user . '.json')->spew("hi");
	path($path . '/' . $user . '.json')->spew(
			reformat_insert_data(
				read_validate_file($path, $user), $q
			));
	chmod 0777, $path;
	chmod 0777, $path . '/' . $user . '.json';
	print "updated";
}

BEGIN {
	my $cgi = new CGI;
	my $data_dir_name = "data";
	print $cgi->header(-type => "text/plain");
	
	if ($cgi->param("method") eq "get_data") {
		if (defined $cgi->param("user")) {
			get_my_info($data_dir_name, $cgi->param("user"));
		}
		else {
			print "undefined user";
			exit
		}
	}
	elsif ($cgi->param("method") eq "post_data") {
		if (defined $cgi->param("user")) {
			input_new_info($data_dir_name, $cgi->param("user"), $cgi);
		}
		else {
			print "undefined user";
			exit
		}
	}
	else {
		print "invalid method\n";
	}
	
	open(STDERR, ">&STDOUT");
}