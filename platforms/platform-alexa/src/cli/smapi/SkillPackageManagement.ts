import { execAsync } from '@jovotech/cli-core';
import { UnknownObject } from '@jovotech/framework';
import { getAskError } from '../utilities';

export async function createNewUploadUrl(): Promise<string> {
  try {
    const { stdout } = await execAsync('ask smapi create-upload-url');
    const uploadUrl: string = JSON.parse(stdout!);
    return uploadUrl;
  } catch (error) {
    throw getAskError('smapiCreateUploadUrl', error.stderr);
  }
}

export async function createSkillPackage(location: string, askProfile?: string): Promise<string> {
  try {
    const cmd: string[] = [
      'ask smapi create-skill-package',
      '--full-response',
      `--location ${location}`,
    ];

    if (askProfile) {
      cmd.push(`-p ${askProfile}`);
    }

    const { stdout } = await execAsync(cmd.join(' '));
    return parseImportUrl(JSON.parse(stdout!));
  } catch (error) {
    throw getAskError('smapiCreateSkillPackage', error.stderr);
  }
}

export async function importSkillPackage(
  location: string,
  skillId: string,
  askProfile?: string,
): Promise<string> {
  try {
    const cmd: string[] = [
      'ask smapi import-skill-package',
      '--full-response',
      `--location ${location}`,
      `-s ${skillId}`,
    ];

    if (askProfile) {
      cmd.push(`-p ${askProfile}`);
    }

    const { stdout } = await execAsync(cmd.join(' '));
    return parseImportUrl(JSON.parse(stdout!));
  } catch (error) {
    throw getAskError('smapiImportSkillPackage', error.stderr);
  }
}

function parseImportUrl({ headers }: UnknownObject): string {
  // Try to parse the import url from command result
  // TODO: Test & Typings
  return (
      // @ts-ignore
    headers
      // @ts-ignore
      .find((header) => header.key === 'location')
      .value.split('/')
      .pop()
  );
}
