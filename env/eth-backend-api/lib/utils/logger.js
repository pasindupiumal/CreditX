'use strict';

const util = require('util');
const chalk = require('chalk');

const signs = [
	'==>',
	'!!!',
	'xx>',
	'===',
	'>>>',
	'xxx',
	'=H=',
	'   '
];

const types = [
	'eth',
	'wsc',
	'sys',
	'his'
];

const verbosity = [
	[],
	['error', 'warn'],
	['info', 'error', 'warn', 'success'],
	['info', 'stats', 'sstats', 'error', 'warn', 'success', 'time', 'timeEnd']
];

const ENV_VERBOSITY = process.env.VERBOSITY || 2;

[
	{
		name: "info",
		sign: '=i=',
		signColor: chalk.blue,
		messageColor: chalk.bold,
		formatter: function (sign, message)
		{
			return [sign, message];
		}
	},
	{
		name: "stats",
		inherit: 'log',
		sign: '=s=',
		signColor: chalk.blue,
		messageColor: chalk.bold,
		formatter: function (sign, message)
		{
			return [sign, message];
		}
	},
	{
		name: "success",
		inherit: 'log',
		sign: '=✓=',
		signColor: chalk.green,
		messageColor: chalk.bold.green,
		formatter: function (sign, message)
		{
			return [sign, message];
		}
	},
	{
		name: "sstats",
		inherit: 'log',
		sign: '=✓=',
		signColor: chalk.green,
		messageColor: chalk.bold.green,
		formatter: function (sign, message)
		{
			return [sign, message];
		}
	},
	{
		name: "warn",
		sign: '=!=',
		signColor: chalk.yellow,
		messageColor: chalk.bold.yellow,
		formatter: function (sign, message)
		{
			return [sign, message];
		}
	},
	{
		name: "error",
		sign: '=✘=',
		signColor: chalk.red,
		messageColor: chalk.bold.red,
		formatter: function (sign, message)
		{
			return [sign, message];
		}
	},
	{
		name: "time",
		sign: '=T=',
		signColor: chalk.cyan,
		messageColor: chalk.bold,
		formatter: function (sign, message)
		{
			return [util.format.apply(util, [sign, message])];
		}
	},
	{
		name: "timeEnd",
		sign: '=T=',
		signColor: chalk.cyan,
		messageColor: chalk.bold,
		formatter: function (sign, message)
		{
			return [util.format.apply(util, [sign, message])];
		}
	}
].forEach( function (item)
{
	const fnName = item.name;

	if(item.inherit !== undefined)
		console[item.name] = console[item.inherit];

	const fn = console[item.name];

	console[item.name] = function ()
	{
		if(verbosity[ENV_VERBOSITY].indexOf(fnName) === -1)
			return false;

		const args = Array.prototype.slice.call(arguments);
		let sign = item.sign;
		let section = 'eth';
		let message = '';

		if (signs.indexOf(args[0]) >= 0)
		{
			sign = args.splice(0, 1);
		}

		if (types.indexOf(args[0]) >= 0)
		{
			section = args.splice(0, 1);
		}

		sign = item.signColor( '[' + section + '] ' + sign );

		if (typeof args[0] === 'object')
		{
			message = util.inspect( args[0], { depth: null, colors: true } );
		}
		else {
			message = item.messageColor( util.format.apply(util, args) );
		}

		return fn.apply( this, item.formatter(sign, message) );
	}
});