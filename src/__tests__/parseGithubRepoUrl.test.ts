import { describe, expect, it } from 'vitest';
import { parseGithubRepoUrl } from '@/modules/resources/infrastructure/github/parseGithubRepoUrl';

describe('parseGithubRepoUrl', () => {
  it('parses https://github.com/owner/repo', () => {
    expect(parseGithubRepoUrl('https://github.com/Itqan-community/RATQ')).toEqual({
      owner: 'Itqan-community',
      repo: 'RATQ',
    });
  });

  it('strips a trailing slash', () => {
    expect(parseGithubRepoUrl('https://github.com/owner/repo/')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('strips a .git suffix', () => {
    expect(parseGithubRepoUrl('https://github.com/owner/repo.git')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('strips .git and a trailing slash together', () => {
    expect(parseGithubRepoUrl('https://github.com/owner/repo.git/')).toEqual({
      owner: 'owner',
      repo: 'repo',
    });
  });

  it('returns null for http URLs', () => {
    expect(parseGithubRepoUrl('http://github.com/owner/repo')).toBeNull();
  });

  it('returns null for non-github hosts', () => {
    expect(parseGithubRepoUrl('https://gitlab.com/owner/repo')).toBeNull();
    expect(parseGithubRepoUrl('https://www.github.com/owner/repo')).toBeNull();
  });

  it('returns null for extra path segments', () => {
    expect(parseGithubRepoUrl('https://github.com/owner/repo/tree/main')).toBeNull();
    expect(parseGithubRepoUrl('https://github.com/owner/repo/issues/189')).toBeNull();
  });

  it('returns null when owner or repo is missing', () => {
    expect(parseGithubRepoUrl('https://github.com/owner')).toBeNull();
    expect(parseGithubRepoUrl('https://github.com/')).toBeNull();
  });

  it('returns null for missing, empty, or invalid URLs', () => {
    expect(parseGithubRepoUrl(null)).toBeNull();
    expect(parseGithubRepoUrl(undefined)).toBeNull();
    expect(parseGithubRepoUrl('')).toBeNull();
    expect(parseGithubRepoUrl('not-a-url')).toBeNull();
  });
});
