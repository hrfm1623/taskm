#!/usr/bin/env node
const { execSync } = require('child_process');

const SEVERITY = { none: 0, patch: 1, minor: 2, major: 3 };

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function tryRun(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return '';
  }
}

function parseTag(tag) {
  if (!tag) return null;
  const match = tag.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Latest tag '${tag}' is not a valid SemVer tag`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function formatTag(version) {
  return version.startsWith('v') ? version : `v${version}`;
}

function bumpVersion(current, level) {
  const next = { ...current };
  if (level === SEVERITY.major) {
    next.major += 1;
    next.minor = 0;
    next.patch = 0;
  } else if (level === SEVERITY.minor) {
    next.minor += 1;
    next.patch = 0;
  } else if (level === SEVERITY.patch) {
    next.patch += 1;
  }
  return `${next.major}.${next.minor}.${next.patch}`;
}

function collectCommits(range) {
  const logCmd = range
    ? `git log ${range} --pretty=format:%H%x1f%s%x1f%b%x1e`
    : 'git log --pretty=format:%H%x1f%s%x1f%b%x1e';
  const raw = tryRun(logCmd);
  if (!raw) return [];
  return raw
    .split('\x1e')
    .filter(Boolean)
    .map((entry) => {
      const [hash = '', subject = '', body = ''] = entry.split('\x1f');
      const cleanedHash = hash.trim();
      return {
        hash: cleanedHash,
        shortHash: cleanedHash.slice(0, 7),
        subject: subject.trim(),
        body: body.trim(),
      };
    });
}

function buildChangelog(tagName, categories) {
  const date = new Date().toISOString().split('T')[0];
  const sections = [];

  const sectionOrder = [
    { key: 'breaking', title: 'Breaking Changes' },
    { key: 'features', title: 'Features' },
    { key: 'fixes', title: 'Fixes' },
    { key: 'others', title: 'Others' },
  ];

  for (const { key, title } of sectionOrder) {
    const items = categories[key];
    if (items.length === 0) continue;
    const lines = items.map((item) => `- ${item.subject} (${item.shortHash})`).join('\n');
    sections.push(`### ${title}\n${lines}`);
  }

  if (sections.length === 0) {
    sections.push('No notable changes in this release.');
  }

  return `## ${tagName} (${date})\n\n${sections.join('\n\n')}\n`;
}

function main() {
  let latestTag = null;
  try {
    latestTag = run('git describe --tags --abbrev=0');
  } catch (err) {
    latestTag = null;
  }

  const range = latestTag ? `${latestTag}..HEAD` : '';
  const commits = collectCommits(range);

  if (commits.length === 0) {
    const result = {
      release: false,
      reason: latestTag ? 'No new commits since last tag' : 'Repository has no commits',
      version: null,
      tag: null,
      previousTag: latestTag,
      changelog: '',
    };
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  let highestSeverity = 0;
  let releaseAsVersion = null;
  const categories = {
    breaking: [],
    features: [],
    fixes: [],
    others: [],
  };

  const releaseDirectiveRegex = /release:\s*(major|minor|patch)/i;
  const releaseAsRegex = /release-as:\s*v?(\d+\.\d+\.\d+)/i;

  for (const commit of commits) {
    const { subject, body } = commit;

    if (!releaseAsVersion) {
      const releaseAsMatch = body.match(releaseAsRegex);
      if (releaseAsMatch) {
        releaseAsVersion = releaseAsMatch[1];
      }
    }

    const directiveMatch = body.match(releaseDirectiveRegex);
    if (directiveMatch) {
      const level = directiveMatch[1].toLowerCase();
      highestSeverity = Math.max(highestSeverity, SEVERITY[level] || 0);
    }

    const hasBreaking = subject.includes('!:') || /BREAKING CHANGE:/i.test(body);
    const isFeature = /^feat(\(|:)/i.test(subject);
    const isPatch = /^(fix|perf|refactor)(\(|:)/i.test(subject);

    if (hasBreaking) {
      categories.breaking.push(commit);
      highestSeverity = Math.max(highestSeverity, SEVERITY.major);
    } else if (isFeature) {
      categories.features.push(commit);
      highestSeverity = Math.max(highestSeverity, SEVERITY.minor);
    } else if (isPatch) {
      categories.fixes.push(commit);
      highestSeverity = Math.max(highestSeverity, SEVERITY.patch);
    } else {
      categories.others.push(commit);
    }
  }

  const hasRelease = Boolean(releaseAsVersion || highestSeverity > 0);
  if (!hasRelease) {
    const result = {
      release: false,
      reason: 'No release-qualified commits found',
      version: null,
      tag: null,
      previousTag: latestTag,
      changelog: '',
    };
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  let nextVersion;
  if (releaseAsVersion) {
    nextVersion = releaseAsVersion.replace(/^v/, '');
  } else if (!latestTag) {
    nextVersion = '0.1.0';
  } else {
    const parsed = parseTag(latestTag);
    nextVersion = bumpVersion(parsed, highestSeverity);
  }

  const tagName = formatTag(nextVersion);
  const changelog = buildChangelog(tagName, categories);

  const result = {
    release: true,
    version: nextVersion,
    tag: tagName,
    previousTag: latestTag,
    changelog,
  };

  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (err) {
  console.error(`prepare-release failed: ${err.message}`);
  process.exit(1);
}
