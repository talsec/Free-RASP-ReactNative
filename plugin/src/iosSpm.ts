const FREERASP_SPM_ACTIVATION_TAG =
  '# @generated freerasp-react-native (SPM activation)';
const FREERASP_SPM_DISABLED_TAG =
  '# @generated freerasp-react-native (SPM disabled)';
const FREERASP_SPM_EMBED_TAG = '# @generated freerasp-react-native (SPM embed)';

const PREPARE_REACT_NATIVE_ANCHOR = 'prepare_react_native_project!';
const REACT_NATIVE_POST_INSTALL_ANCHOR = 'react_native_post_install(';

export interface PodfileMutationResult {
  contents: string;
  changed: boolean;
  missingAnchors: string[];
}

const indentationAt = (contents: string, index: number): string => {
  const lineStart = contents.lastIndexOf('\n', index - 1) + 1;
  return contents.slice(lineStart, index).match(/^\s*/)?.[0] ?? '';
};

const removeManagedBlock = (
  contents: string,
  tag: string,
  bodyLineCount: number
): string => {
  const newline = contents.includes('\r\n') ? '\r\n' : '\n';
  const lines = contents.split(/\r?\n/);
  const tagIndex = lines.findIndex((line) => line.trim() === tag);

  if (tagIndex === -1) {
    return contents;
  }

  let startIndex = tagIndex;
  while (startIndex > 0 && lines[startIndex - 1]?.trim() === '') {
    startIndex -= 1;
  }
  lines.splice(startIndex, tagIndex - startIndex + bodyLineCount + 1);
  return lines.join(newline);
};

const findClosingParenthesis = (
  contents: string,
  openingIndex: number
): number => {
  let depth = 0;
  let quote: "'" | '"' | undefined;
  let escaped = false;
  let inComment = false;

  for (let index = openingIndex; index < contents.length; index += 1) {
    const character = contents[index];

    if (inComment) {
      if (character === '\n') {
        inComment = false;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === '#') {
      inComment = true;
    } else if (character === "'" || character === '"') {
      quote = character;
    } else if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
};

const mutatePodfileForFreeraspSpm = (
  contents: string,
  enabled = true
): PodfileMutationResult => {
  let updatedContents = removeManagedBlock(
    contents,
    FREERASP_SPM_ACTIVATION_TAG,
    1
  );
  updatedContents = removeManagedBlock(
    updatedContents,
    FREERASP_SPM_DISABLED_TAG,
    1
  );
  updatedContents = removeManagedBlock(
    updatedContents,
    FREERASP_SPM_EMBED_TAG,
    4
  );

  const missingAnchors: string[] = [];
  const prepareIndex = updatedContents.indexOf(PREPARE_REACT_NATIVE_ANCHOR);
  const postInstallIndex = enabled
    ? updatedContents.indexOf(REACT_NATIVE_POST_INSTALL_ANCHOR)
    : -1;
  const postInstallOpeningIndex =
    postInstallIndex === -1
      ? -1
      : postInstallIndex + REACT_NATIVE_POST_INSTALL_ANCHOR.length - 1;
  const postInstallClosingIndex =
    postInstallOpeningIndex === -1
      ? -1
      : findClosingParenthesis(updatedContents, postInstallOpeningIndex);

  if (prepareIndex === -1) {
    missingAnchors.push(PREPARE_REACT_NATIVE_ANCHOR);
  }
  if (enabled && postInstallClosingIndex === -1) {
    missingAnchors.push(REACT_NATIVE_POST_INSTALL_ANCHOR);
  }
  if (missingAnchors.length > 0) {
    return { contents, changed: false, missingAnchors };
  }

  const newline = updatedContents.includes('\r\n') ? '\r\n' : '\n';

  if (enabled) {
    // Insert the later snippet first so the activation insertion cannot
    // invalidate the post-install index calculated above.
    const indent = indentationAt(updatedContents, postInstallIndex);
    const snippet = [
      '',
      '',
      `${indent}${FREERASP_SPM_EMBED_TAG}`,
      `${indent}require Pod::Executable.execute_command('node', ['-p',`,
      `${indent}  'require.resolve("freerasp-react-native/freerasp_spm.rb", {paths: [process.argv[1]]})',`,
      `${indent}  __dir__]).strip`,
      `${indent}freerasp_embed_talsec_spm!(installer)`,
    ].join(newline);
    updatedContents =
      updatedContents.slice(0, postInstallClosingIndex + 1) +
      snippet +
      updatedContents.slice(postInstallClosingIndex + 1);
  }

  const insertAt = prepareIndex + PREPARE_REACT_NATIVE_ANCHOR.length;
  const indent = indentationAt(updatedContents, prepareIndex);
  const configurationSnippet = enabled
    ? [
        '',
        '',
        `${indent}${FREERASP_SPM_ACTIVATION_TAG}`,
        `${indent}ENV['FREERASP_USE_SPM'] = '1' unless ENV['FREERASP_USE_SPM'] == '0'`,
      ]
    : [
        '',
        '',
        `${indent}${FREERASP_SPM_DISABLED_TAG}`,
        `${indent}ENV['FREERASP_USE_SPM'] = '0'`,
      ];
  updatedContents =
    updatedContents.slice(0, insertAt) +
    configurationSnippet.join(newline) +
    updatedContents.slice(insertAt);

  return {
    contents: updatedContents,
    changed: updatedContents !== contents,
    missingAnchors: [],
  };
};

export default mutatePodfileForFreeraspSpm;
