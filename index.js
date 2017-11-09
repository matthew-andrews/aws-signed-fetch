'use strict';

// TODO: Pull this out into a dedicated library that could be shared across all apps

const aws4 = require('aws4');
const urlParse = require('url').parse;
const aws = require('aws-sdk');
const denodeify = require('denodeify');
const getCredentials = denodeify(aws.config.getCredentials.bind(aws.config));
const fetch = require('node-fetch');

module.exports = (url, options) => getCredentials()
	.then(credentials => {
		options = options || {};
		const signable = {};
		const urlObject = urlParse(url);
		signable.host = urlObject.host;
		signable.path = urlObject.path;
		['method', 'body', 'headers', 'region', 'service'].forEach(key => signable[key] = options[key]);
		aws4.sign(signable, credentials);
		options.headers = signable.headers;
		return fetch(url, options, credentials);
	});