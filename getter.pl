#!/usr/bin/perl

use strict;
use warnings;
use Path::Tiny;
use JSON;

sub get_data {
	my ($url) = @_;
	my $p = `curl -s "$url"`;
	$p =~ s/\n//g;
	return $p;
}

sub parse_data {
	my ($data) = @_;
	$data = decode_json($data);
	my @har;
	foreach my $value (@{$data}) {
		my %href;
		$href{symbol} = $value->{symbol};
		$href{location} = "SomeWallet";
		$href{amt} = 5;
		push (@har, \%href);
	}
	my %d = (wallets => \@har);
	my $hd = encode_json(\%d);
	return $hd;
}

sub write_data {
	my ($url) = @_;
	my $parsed = parse_data(get_data($url));
	path("output.json")->spew($parsed);
	return;
}

BEGIN {
	my $url = "https://api.coinmarketcap.com/v1/ticker/";
	write_data($url);
}