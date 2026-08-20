#!/usr/bin/env bash

# Cloud Agent install script.
#
# Cursor's default Cloud Agent image does not ship `mise`, which this repo uses
# as its task runner and toolchain manager. This script bootstraps `mise` when
# it is missing, makes it discoverable to both non-interactive tooling and
# terminal shells, then installs the pinned toolchain and project dependencies.
#
# It is idempotent: it is safe to run repeatedly and against cached state.

set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"

if ! command -v mise >/dev/null 2>&1; then
  curl -fsSL https://mise.run | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

mise_bin="$(command -v mise)"

# Expose `mise` on a directory that is always on PATH so the environment's
# terminal commands (e.g. `mise //:types`) resolve it regardless of shell rc.
# Skip when `mise` already lives there, otherwise `ln` errors that the source
# and destination are the same file and aborts the rest of install.
if [ "$mise_bin" != "/usr/local/bin/mise" ] &&
  command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
  sudo ln -sf "$mise_bin" /usr/local/bin/mise
fi

# Fallback for interactive shells that source ~/.bashrc.
if ! grep -q 'mise activate bash' "$HOME/.bashrc" 2>/dev/null; then
  {
    echo 'export PATH="$HOME/.local/bin:$PATH"'
    echo 'eval "$(mise activate bash)"'
  } >>"$HOME/.bashrc"
fi

mise trust --yes
mise install
mise x -- pnpm install --frozen-lockfile
