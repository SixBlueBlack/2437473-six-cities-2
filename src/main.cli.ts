#!/usr/bin/env node

import CliApplication from './app/cli.js';
import HelperCommand from './core/cli-command/helper.command.js';
import {VersionCommand} from './core/cli-command/version.command.js';
import ImportCommand from './core/cli-command/import.command.js';
import GenerateCommand from './core/cli-command/generate-command.js';

const myManager = new CliApplication();
myManager.registerCommands([new HelperCommand, new VersionCommand, new ImportCommand, new GenerateCommand]);
myManager.processCommand(process.argv);
