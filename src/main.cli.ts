#!/usr/bin/env node

import CliApplication from './app/cli.js';
import HelperCommand from './core/cli-command/helper.command.js';
import {VersionCommand} from './core/cli-command/version.command.js';
import ImportCommand from './core/cli-command/import.command.js';

const myManager = new CliApplication();
myManager.registerCommands([new HelperCommand, new VersionCommand, new ImportCommand]);
myManager.processCommand(process.argv);
